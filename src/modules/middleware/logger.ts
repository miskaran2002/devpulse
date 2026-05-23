import type { NextFunction, Request, Response } from "express";
import fs from "fs";

const logger = (req :Request, res:Response, next : NextFunction) => {

    console.log("Method -- Time --url:", req.method, Date.now(), req.url);

    
    const log = `${req.method} -- ${Date.now()} -- ${req.url}\n`;

    fs.appendFile('server.log', log, (err) => {
        if (err) {
            console.log("Error writing to log file:", err);
        }
    });

    
    next();

}
export default logger;