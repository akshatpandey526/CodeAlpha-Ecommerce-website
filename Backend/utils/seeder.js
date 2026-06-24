const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const connectDB = require('../config/db');
const Product = require('../model/Product');
const User = require('../model/User');

const seedData = async () => {
    try {
        await connectDB();

        // Find or create a default admin user to assign products to
        const adminEmail = (process.env.EMAIL_USER || 'admin@codealpha.com').toLowerCase().trim();
        const adminPassword = process.env.EMAIL_PASS || 'admin123';

        let adminUser = await User.findOne({ email: adminEmail });
        if (!adminUser) {
            // Create a default admin user if none exists
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);
            adminUser = await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
            console.log(`Created default admin user: ${adminEmail} / ${adminPassword}`);
        } else {
            // Make sure the existing user with this email has 'admin' role
            if (adminUser.role !== 'admin') {
                adminUser.role = 'admin';
                await adminUser.save();
                console.log(`Updated user ${adminEmail} to have admin role.`);
            }
        }

        // Clear existing products
        await Product.deleteMany({});
        console.log('Existing products cleared.');

        const sampleProducts = [
            {
                user: adminUser._id,
                name: 'AeroSync Wireless ANC Headphones',
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
                brand: 'AeroSound',
                category: 'Audio',
                description: 'Experience pure sonic bliss with high-fidelity drivers, active noise cancellation, and a sleek modern dark indigo aesthetic design with 40-hour battery life.',
                price: 8499,
                countInStock: 15
            },
            {
                user: adminUser._id,
                name: 'KeyForge Cyberpunk Mechanical Keyboard',
                image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
                brand: 'ForgeKeys',
                category: 'Peripherals',
                description: 'Frosted glass acrylic casing, hot-swappable tactile switches, dynamic purple underglow lighting, and customized keycaps designed for premium desktop setups.',
                price: 5999,
                countInStock: 8
            },
            {
                user: adminUser._id,
                name: 'Chronos Smart Watch Elite',
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
                brand: 'Chronos',
                category: 'Wearables',
                description: 'A premium smart watch featuring a circular OLED display, heart-rate tracking, sleep metrics, custom animated glass widgets, and 7-day battery life.',
                price: 11999,
                countInStock: 12
            },
            {
                user: adminUser._id,
                name: 'Lumina RGB Desk Lamp',
                image: 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?auto=format&fit=crop&w=600&q=80',
                brand: 'Lumina',
                category: 'Smart Home',
                description: 'Ambient smart light with customizable gradient schemes, voice control assistant compatibility, and sleek minimal aluminum alloy frame.',
                price: 2499,
                countInStock: 25
            }
        ];

        await Product.insertMany(sampleProducts);
        console.log('Database seeded with sample products successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error.message);
        process.exit(1);
    }
};

seedData();
