const Merchandising = require('../models/merchandising.model');

async function getMerchandising(req, res) {
    try {
        const { id } = req.params;
        console.log(id);
        const merchandising = await Merchandising.findById(id);
        // const merchandising = await Merchandising.findOne({ slug: id });
        if (!merchandising) {
            return res.status(404).json({ message: 'Merchandising no encontrado.' });
        }
        res.json(merchandising);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getMerchandising
}