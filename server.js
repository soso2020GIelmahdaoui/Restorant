const path = require('path');
const { PrismaClient } = require("@prisma/client");
const dotenv = require('dotenv');
const express = require('express');

const prisma = new PrismaClient();

dotenv.config();

const app = express();

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));
app.use(express.static(path.join(__dirname, 'Public')));

// Middleware to parse JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importing route files
const restaurantRoutes = require('./Routes/RestaurantRoute.js');
const repasRoutes = require('./Routes/RepasRoute.js');
const ChefRoutes = require('./Routes/ChefRoute.js');
const categorierepasRoutes = require('./Routes/CategorieRoute.js');
const newsletterRoutes = require('./Routes/NewsletterRoute.js');

// Mounting the routes
app.use('/restaurants', restaurantRoutes);
app.use('/repas', repasRoutes);
app.use('/chefs', ChefRoutes);
app.use('/categories', categorierepasRoutes);
app.use('/newsletters', newsletterRoutes);

// Routes
app.get('/', async (req, res) => {
    try {
        const categories = await prisma.Categories.findMany({
            include: { Repas: true }
        });

        const categorizedRepas = {
            breakfast: [],
            launch: [],
            dinner: []
        };

        categories.forEach(category => {
            category.Repas.forEach(repas => {
                if (category. type_category.toLowerCase() === 'breakfast') {
                    categorizedRepas.breakfast.push(repas);
                } else if (category. type_category.toLowerCase() === 'launch') {
                    categorizedRepas.launch.push(repas);
                } else if (category. type_category.toLowerCase() === 'dinner') {
                    categorizedRepas.dinner.push(repas);
                }
            });
        });

        res.render('index', { categorizedRepas, currentPage: 'home'});
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Error fetching categories: ' + error.message);
    }
});

app.get('/about', (req, res) => {
    res.render('about', { currentPage: 'about'});
});

app.get('/contact', (req, res) => {
    res.render('contact', { currentPage: 'contact'});
});

app.get('/addMeal', async (req, res) => {
    try {
        const categories = await prisma.Categories.findMany();
        const restaurants = await prisma.Restorant.findMany();
        res.render('addMeal', { categories, restaurants, currentPage: 'addMeal' });
        
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Error fetching categories: ' + error.message);
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
