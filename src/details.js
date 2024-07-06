import React from 'react';
import { Sparkles, Zap, Award } from 'lucide-react';

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
        <div className="text-purple-600 mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const InfoDetails = () => {
    return (
        <section className="py-12 sm:px-32 bg-gradient-to-b from-purple-100 to-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Why Choose Preview?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Sparkles size={48} />}
                        title="Beautiful Designs"
                        description="Create stunning app screenshots that catch the eye and boost downloads."
                    />
                    <FeatureCard
                        icon={<Zap size={48} />}
                        title="Fast and Easy"
                        description="Our intuitive interface lets you create professional screenshots in minutes."
                    />
                    <FeatureCard
                        icon={<Award size={48} />}
                        title="Completely Free"
                        description="All features are available for free. No hidden costs or premium plans."
                    />
                </div>
            </div>
        </section>
    );
};

export default InfoDetails;