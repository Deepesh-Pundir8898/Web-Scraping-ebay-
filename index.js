const axios = require('axios');
const cheerio = require('cheerio');
const xlsx = require('xlsx');
const fs = require('fs');

const scrapeEbayProductsToExcel = async () => {
    try {
        const url = 'https://www.ebay.com/sch/i.html?_from=R40&_trksid=p4432023.m570.l1311&_nkw=mobile+phones&_sacat=0';

        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);

        const products = [];

        $('.s-item').each((index, element) => {
            const title = $(element).find('.s-item__title').text().trim();
            const price = $(element).find('.s-item__price').text().trim();
            const rating = $(element).find('.b-starrating__star').attr('aria-label') || 'No rating';
            const availableQuantity = $(element).find('.s-item__quantityAvailable').text().trim() || 'Unknown';

            if (title) {
                products.push({
                    Title: title,
                    Price: price,
                    Rating: rating,
                    Available_Quantity: availableQuantity,
                });
            }
        });

        // Convert data to Excel
        const worksheet = xlsx.utils.json_to_sheet(products);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Products');

        // Save Excel file locally
        const filePath = './ebay-products.xlsx';
        xlsx.writeFile(workbook, filePath);

        console.log('Scraped data saved to ebay-products.xlsx');

    } catch (error) {
        console.error('Error during scraping:', error.message);
    }
};

scrapeEbayProductsToExcel();
