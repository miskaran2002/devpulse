import { pool } from "../../db";


const createIssueIntoDB = async (payload: any) => {
  const { title, description, type } = payload;

  // temporary user id 
  const reporter_id = 2;

 

  const result = await pool.query(
    `
    INSERT INTO issues (title, description, type, reporter_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [title, description, type, reporter_id]
  );

  return result.rows[0];
};

export const issueService = {
  createIssueIntoDB,
};