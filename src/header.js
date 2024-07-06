import React from 'react';
import { Camera } from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Camera size={32} />
                    <h1 className="text-2xl font-bold">Preview</h1>
                </div>
                <nav className="hidden md:flex space-x-4">
                    <a href="#" className="hover:text-purple-200 font-semibold transition-colors">Home</a>
                    <a href="#" className="hover:text-purple-200 font-semibold transition-colors">Features</a>
                    <a href="#" className="hover:text-purple-200 font-semibold transition-colors">Contact</a>
                </nav>
                <button className="md:hidden text-2xl">☰</button>
            </div>
        </header>
    );
};

export default Header;