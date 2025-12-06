import express from 'express';
import prisma from '../prismaclient.js';

const router = express.Router();

//get movies
router.get('/', async (req, res) => {
    try {
        const movies = await prisma.movie.findMany({
            where: {
                userId: req.userId
            },
            orderBy: {
                id: 'desc'
            }
        });
        res.json(movies);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Error fetching movies" });
    }
});

//add new movie
router.post('/', async (req, res) => {
    const { moviename, rating } = req.body;
    
    try {
        const movie = await prisma.movie.create({
            data: {
                moviename,
                rating: rating || 0,
                userId: req.userId
            }
        });
        
        res.json(movie);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Error adding movie" });
    }
});

//delete a movie
router.delete(`/:id`, async (req, res) => {
    const { id } = req.params;
    
    try {
        // First verify the movie belongs to the user
        const movie = await prisma.movie.findFirst({
            where: {
                id: parseInt(id),
                userId: req.userId
            }
        });

        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        await prisma.movie.delete({
            where: {
                id: parseInt(id)
            }
        });
        
        res.json({ message: "Movie deleted successfully" });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Error deleting movie" });
    }
});

export default router;