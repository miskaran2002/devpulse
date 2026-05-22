import { pool } from "../../db";

interface IIssue {
  title: string;
  description: string;
  type: "bug" | "feature_request";
}
// reporter_id will come from req.user.id after auth implementation
const createIssueIntoDB = async (payload: IIssue) => {
  const { title, description, type } = payload;

  // temporary reporter id
  // later this will come from req.user.id
  const reporter_id = 1;
  // const reporter_id = req.user.id;

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

export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
};