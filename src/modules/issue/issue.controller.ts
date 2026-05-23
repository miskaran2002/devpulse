import type { Request, Response } from "express";
import { issueService } from "./issue.service";


// create issue
const createIssue = async (req: Request, res: Response) => {
  try {

    const payload = {
      ...req.body,
      reporter_id: req.user.id,
    };
    const result = await issueService.createIssueIntoDB(payload);

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

    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue id",
      });
    }

    const result = await issueService.getSingleIssueFromDB(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Issue not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update issue
const updateIssue = async (req: Request, res: Response) => {
  try {

    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue id",
      });
    }

    const result = await issueService.updateIssueIntoDB(id, req.body);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Issue not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete issue

const deleteIssue = async (req: Request, res: Response) => {
  try {

    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue id",
      });
    }

    const result = await issueService.deleteIssueFromDB(
      id,
      req.user
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Issue not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Issue deleted successfully!",
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMetrics = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getMetricsFromDB(req.user);

    res.status(200).json({
      success: true,
      message: "Metrics fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
  getMetrics
};