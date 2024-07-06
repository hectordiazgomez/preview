import React from 'react';
import { Github, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="flex sm:px-32 flex-wrap justify-between items-center">
                    <div className="w-full md:w-1/3 text-center md:text-left mb-4 md:mb-0">
                        <h2 className="text-xl font-bold">Preview</h2>
                        <p className="mt-2">Create beautiful app screenshots</p>
                    </div>
                    <div className="w-full md:w-1/3 text-center mb-4 md:mb-0">
                        <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
                        <ul className="sm:space-x-2 sm:flex justify-center">
                            <li><a href="#" className="hover:text-purple-300 transition-colors">Home</a></li>
                            <li><a href="#" className="hover:text-purple-300 transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-purple-300 transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-purple-300 transition-colors">Contact</a></li>
                        </ul>
                    </div>
                    <div className="w-full md:w-1/3 text-center md:text-right">
                        <h3 className="text-lg font-semibold mb-2">Connect With Us</h3>
                        <div className="flex justify-center md:justify-end space-x-4">
                            <a href="#" className="hover:text-purple-300 transition-colors"><Github size={24} /></a>
                            <a href="#" className="hover:text-purple-300 transition-colors"><Twitter size={24} /></a>
                            <a href="#" className="hover:text-purple-300 transition-colors"><Facebook size={24} /></a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-center text-sm">
                    <p>&copy; 2024 Preview. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;