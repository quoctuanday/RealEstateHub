class PostController {
    create(req, res) {
        const data = req.body.data;
        console.log(data);
    }
}
module.exports = new PostController();
