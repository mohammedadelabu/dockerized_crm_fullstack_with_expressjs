import { ok } from "assert";
import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  // res.render('index', { title: 'Express' });
  res.status(200).send({status:ok,response: 'api is working'})
});

export default router;
