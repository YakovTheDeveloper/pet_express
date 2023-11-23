import { Router } from 'express';
var router = Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log("WTF")
    res.json({ title: 'Express20' });
});

export default router;
