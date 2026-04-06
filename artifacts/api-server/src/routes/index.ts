import { Router, type IRouter } from "express";
import healthRouter from "./health";
import datasetsRouter from "./datasets.js";
import pagesRouter from "./pages.js";
import blogPostsRouter from "./blog-posts.js";
import analisisRouter from "./analisis.js";
import featuredInsightsRouter from "./featured-insights.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/datasets", datasetsRouter);
router.use("/pages",    pagesRouter);
router.use("/blog",     blogPostsRouter);
router.use("/analisis", analisisRouter);
router.use("/featured-insights", featuredInsightsRouter);

export default router;
