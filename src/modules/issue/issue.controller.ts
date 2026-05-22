import type { Request, Response } from "express";
import { issueService } from "./issue.service";


// create issue
const createIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.createIssueIntoDB(req.body);

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};


// get all issues
const getAllIssues = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getAllIssuesFromDB(req.query);

    res.status(200).json({
      "status": "success",
      "message": "Issues retrieved successfully!",
      "data": result,
    });
  } catch (error: any) {
    res.status(500).json({
      "status": "error",
      "message": error.message,
      "error": error
    });
  }
};

// get single issue
const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getSingleIssueFromDB(
      Number(req.params.id)
    );

    if (!result) {
      return res.status(404).json({
        "success": false,
        "status": "error",
        "message": "Issue not found!"
      });

    }

    res.status(200).json({
      "status": "success",
      "message": "Issue retrieved successfully!",
      "data": result
    });

  } catch (error: any) {
    res.status(500).json({
      "status": "error",
      "message": error.message,
      "error": error
    });
  }
};

// update issue
const updateIssue = async (req: Request, res: Response) => {
  try {

    const result = await issueService.updateIssueIntoDB(
      Number(req.params.id),
      req.body
    );

    if (result.rows.length === 0) {


      return res.status(404).json({
        "status": "error",
        "message": "User not found!"
      });

    }


    res.status(200).json({
      "status": "success",
      "message": "Issue updated successfully",
      "data": result,
    });

  } catch (error: any) {

    res.status(500).json({
        "status": "error",
        "message": error.message,
        "error": error
    });
       

  }
};

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
};