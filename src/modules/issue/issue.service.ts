import { pool } from "../../db";
import type { IUpdateIssue } from "./issue.interface";

interface IIssue {
  title: string;
  description: string;
  type: "bug" | "feature_request";
    reporter_id: number;
}
// reporter_id will come from req.user.id after auth implementation
const createIssueIntoDB = async (payload: IIssue) => {
  const { title, description, type } = payload;

  // temporary reporter id
  // later this will come from req.user.id
  const reporter_id = payload.reporter_id;

  const result = await pool.query(
    `
    INSERT INTO issues
    (title, description, type, reporter_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [title, description, type, reporter_id]
  );

  return result;
};


// get all issues with reporter data
const getAllIssuesFromDB = async (query: any) => {
  const { sort = "newest", type, status } = query;

  let sql = `SELECT * FROM issues`;
  const conditions: string[] = [];
  const values: string[] = [];

  // filtering
  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  // add WHERE
  if (conditions.length > 0) {
    sql += ` WHERE ` + conditions.join(" AND ");
  }

  // sorting
  if (sort === "oldest") {
    sql += ` ORDER BY created_at ASC`;
  } else {
    sql += ` ORDER BY created_at DESC`;
  }

  // get issues
  const issuesResult = await pool.query(sql, values);

  const issues = issuesResult.rows;

  // reporter data without JOIN
  const formattedIssues = await Promise.all(
    issues.map(async (issue) => {

      const reporterResult = await pool.query(
        `
        SELECT id, name, role
        FROM users
        WHERE id = $1
        `,
        [issue.reporter_id]
      );

      return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,

        reporter: reporterResult.rows[0] || null,

        created_at: issue.created_at,
        updated_at: issue.updated_at,
      };
    })
  );

  return formattedIssues;
};
// get single issue with reporter data
const getSingleIssueFromDB = async (id: number) => {

  // get issue
  const issueResult = await pool.query(
    `
    SELECT * FROM issues
    WHERE id = $1
    `,
    [id]
  );

  // not found
  if (issueResult.rowCount === 0) {
    throw new Error("Issue not found");
  }

  const issue = issueResult.rows[0];

  // get reporter info
  const reporterResult = await pool.query(
    `
    SELECT id, name, role
    FROM users
    WHERE id = $1
    `,
    [issue.reporter_id]
  );

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,

    reporter: reporterResult.rows[0] || null,

    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};


// update issue
const updateIssueIntoDB = async (
  id: number,
  payload: IUpdateIssue
) => {

  // check issue exists
  const existingIssue = await pool.query(
    `
    SELECT * FROM issues
    WHERE id = $1
    `,
    [id]
  );

  if (existingIssue.rowCount === 0) {
    throw new Error("Issue not found");
  }

  const { title, description, type, status } = payload;

  const result = await pool.query(
    `
    UPDATE issues
    SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      type = COALESCE($3, type),
      status = COALESCE($4, status),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING *
    `,
    [title, description, type, status, id]
  );

  return result.rows[0];
};





// delete issue
const deleteIssueFromDB = async (
  id: number,
  user: any
) => {

   // role check
  if (user.role !== "maintainer") {
    throw new Error(
      "Forbidden access. Maintainer only."
    );
  }

  // check issue exists
  const existingIssue = await pool.query(
    `
    SELECT * FROM issues
    WHERE id = $1
    `,
    [id]
  );

  if (existingIssue.rowCount === 0) {
    throw new Error("Issue not found");
  }

  const result = await pool.query(
    `
    DELETE FROM issues
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};


const getMetricsFromDB = async (user: any) => {

  // role check
  if (user.role !== "maintainer") {
    throw new Error("Forbidden access. Maintainer only.");
  }

  // total issues
  const totalResult = await pool.query(
    `SELECT COUNT(*) FROM issues`
  );

  // open issues
  const openResult = await pool.query(
    `SELECT COUNT(*) FROM issues WHERE status = 'open'`
  );

  // in_progress issues
  const progressResult = await pool.query(
    `SELECT COUNT(*) FROM issues WHERE status = 'in_progress'`
  );

  // resolved issues
  const resolvedResult = await pool.query(
    `SELECT COUNT(*) FROM issues WHERE status = 'resolved'`
  );

  return {
    total: Number(totalResult.rows[0].count),
    open: Number(openResult.rows[0].count),
    in_progress: Number(progressResult.rows[0].count),
    resolved: Number(resolvedResult.rows[0].count),
  };
};

export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB, 
  getSingleIssueFromDB,
  updateIssueIntoDB,
  deleteIssueFromDB,
  getMetricsFromDB,
};