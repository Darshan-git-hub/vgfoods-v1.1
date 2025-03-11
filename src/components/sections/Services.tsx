import { UtensilsCrossed, ShoppingBag, Truck, MessageCircle } from 'lucide-react';

const ServiceCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
    <Icon className="w-10 h-10 text-orange-600 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const Services = () => {
  return (
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Choose how you want to enjoy our delicious food
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ServiceCard
            icon={UtensilsCrossed}
            title="Dine In"
            description="Enjoy your meal in our comfortable restaurant environment"
          />
          <ServiceCard
            icon={ShoppingBag}
            title="Takeaway"
            description="Pick up your order fresh and hot from our restaurant"
          />
          <ServiceCard
            icon={Truck}
            title="Delivery"
            description="Get your favorite dishes delivered to your doorstep"
          />
          <ServiceCard
            icon={MessageCircle}
            title="WhatsApp Order"
            description="Place your order conveniently through WhatsApp"
          />
        </div>
      </div>
    </section>
  );
};

export default Services;