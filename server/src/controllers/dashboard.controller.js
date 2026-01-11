import mongoose from "mongoose";
import PrintRequest from "../models/PrintRequest.js";

export const getDashboardStats = async (req, res) => {
    try {
        const { role, userId } = req.user;
        let stats = {
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0,
            inProgress: 0,
            completed: 0,
        };

        let filter = {};

        // Employee: only see their own requests
        if (role === "EMPLOYEE") {
            filter.teacher = new mongoose.Types.ObjectId(userId);
        }
        // Printing: only see approved/processing/completed (usually they don't care about pending/rejected)
        // But for "stats" we might just show them what they have worked on or what is available.
        // Based on user request: "Printing department show only the total of output approved request, total in progress request and total completed request"
        if (role === "PRINTING") {
            filter.status = { $in: ["APPROVED", "IN_PROGRESS", "COMPLETED"] };
        }

        // Admin sees all (no extra filter)

        // GLOBAL FLITER: Organization Isolation
        filter.organization = new mongoose.Types.ObjectId(req.user.organizationId);

        // Aggregation for performance
        const results = await PrintRequest.aggregate([
            { $match: filter },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        results.forEach(item => {
            if (item._id === "PENDING") stats.pending = item.count;
            if (item._id === "APPROVED") stats.approved = item.count;
            if (item._id === "REJECTED") stats.rejected = item.count;
            if (item._id === "IN_PROGRESS") stats.inProgress = item.count;
            if (item._id === "COMPLETED") stats.completed = item.count;
        });

        stats.total = stats.pending + stats.approved + stats.rejected + stats.inProgress + stats.completed;

        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch dashboard stats" });
    }
};
