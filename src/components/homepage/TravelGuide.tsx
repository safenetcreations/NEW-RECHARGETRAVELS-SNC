import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const TravelGuide = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Free Travel Guide</h2>
          <p className="text-gray-600 mb-6">Download our comprehensive Sri Lanka travel guide</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Download PDF Guide
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default TravelGuide;