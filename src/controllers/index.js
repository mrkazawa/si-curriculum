class IndexController {
    getIndex(req, res) {
        res.send('Welcome to the Express MySQL App!');
    }
}

module.exports = IndexController;