import React, { useState } from 'react';
import ProductCard from './ProductCard';
import Swal from 'sweetalert2';

const ProductSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleNameSearch = async () => {
        try {
            const response = await fetch('http://localhost:4000/products/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productName: searchQuery })
            });
            const data = await response.json();
            
            const activeProducts = data.filter(product => product.isActive);
            setSearchResults(activeProducts);
            if (activeProducts.length === 0) {
                Swal.fire({
                    title: 'Product Not Available',
                    icon: 'error',
                    text: 'The searched product is not available.',
                });
            }
            setSearchQuery(''); // Clear search query
        } catch (error) {
            console.error('Error searching for active product by name:', error);
        }
    };

    const handlePriceSearch = async () => {
        try {
            const response = await fetch('http://localhost:4000/products/searchByPrice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ minPrice, maxPrice })
            });
            const data = await response.json();
            // Filter out inactive products from search results
            const activeProducts = data.filter(product => product.isActive);
            setSearchResults(activeProducts);
            if (activeProducts.length === 0) {
                Swal.fire({
                    title: 'Product Not Available',
                    icon: 'error',
                    text: 'No product available in the specified price range.',
                });
            }
            setMinPrice(''); // Clear min price
            setMaxPrice(''); // Clear max price
        } catch (error) {
            console.error('Error searching for active products by price range:', error);
        }
    };

    return (
        <div>
            <div>
                <h2>Product Search</h2>
                <div className="form-group">
                    <label htmlFor="productName">Product Name:</label>
                    <input
                        type="text"
                        id="productName"
                        className="form-control"
                        value={searchQuery}
                        onChange={event => setSearchQuery(event.target.value)}
                    />
                </div>
                <button className="btn btn-primary" onClick={handleNameSearch}>
                    Search
                </button>
            </div>
            <hr />
            <div>
                <h2>Search Products by Price Range</h2>
                <div className="input-group">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Minimum Price"
                        value={minPrice}
                        onChange={event => setMinPrice(event.target.value)}
                    />
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Maximum Price"
                        value={maxPrice}
                        onChange={event => setMaxPrice(event.target.value)}
                    />
                    <button className="btn btn-primary" onClick={handlePriceSearch}>
                        Search by Price
                    </button>
                </div>
            </div>
            <hr />
            <h3>Search Results:</h3>
            <div className="list-group">
                {searchResults.map(product => (
                    <ProductCard productProp={product} key={product._id}/>
                ))}
            </div>
        </div>
    );
};

export default ProductSearch;
