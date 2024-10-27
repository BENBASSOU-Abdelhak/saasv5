import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ChevronRight, Users, Briefcase, Star, Check, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { airtableService } from '../services/airtable';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

const sectors = [
  { id: 'technology', name: 'Technology', icon: <Building2 />, subsectors: [
    'Software Development', 'AI/ML', 'Cloud Services', 'Cybersecurity'
  ]},
  { id: 'services', name: 'Services', icon: <Briefcase />, subsectors: [
    'Consulting', 'Financial Services', 'Marketing', 'Healthcare'
  ]},
  { id: 'commerce', name: 'Commerce', icon: <Users />, subsectors: [
    'E-commerce', 'Retail', 'Wholesale', 'Import/Export'
  ]},
  { id: 'industry', name: 'Industry', icon: <Star />, subsectors: [
    'Manufacturing', 'Construction', 'Energy', 'Logistics'
  ]}
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    company_name: '',
    activity: '',
    description: '',
    b2b2c: ''
  });
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedSubsectors, setSelectedSubsectors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSectorSelect = (sectorId: string) => {
    setSelectedSector(sectorId);
    nextStep();
  };

  const handleSubsectorToggle = (subsector: string) => {
    setSelectedSubsectors(prev => 
      prev.includes(subsector)
        ? prev.filter(s => s !== subsector)
        : [...prev, subsector]
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) throw new Error('User not found');

      await airtableService.updateUser(user.id, {
        company_name: formData.company_name,
        activity: selectedSubsectors.join(', '),
        description: formData.description,
        b2b2c: formData.b2b2c
      });

      navigate('/leads-searcher');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-2xl mx-auto pt-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-center">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === step ? 'w-8 bg-indigo-600' : 'bg-indigo-200'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-xl shadow-lg overflow-hidden backdrop-blur-lg bg-opacity-90"
          >
            {step === 1 && (
              <div className="p-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex justify-center mb-6"
                >
                  <Building2 className="w-16 h-16 text-indigo-600" />
                </motion.div>
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                  Commençons par le nom de votre entreprise
                </h2>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="max-w-md mx-auto"
                >
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, company_name: e.target.value }));
                    }}
                    className="block w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="ex: Digital Growth Solutions"
                    autoFocus
                  />
                  {formData.company_name && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={nextStep}
                      className="mt-6 w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Continuer
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </motion.button>
                  )}
                </motion.div>
              </div>
            )}

            {step === 2 && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                  Quel est votre secteur d'activité ?
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {sectors.map((sector) => (
                    <motion.button
                      key={sector.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSectorSelect(sector.id)}
                      className="p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-500 transition-all duration-200"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 flex items-center justify-center text-indigo-600 mb-3">
                          {sector.icon}
                        </div>
                        <span className="text-lg font-medium text-gray-900">{sector.name}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && selectedSector && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                  Précisez vos domaines d'expertise
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {sectors.find(s => s.id === selectedSector)?.subsectors.map((subsector) => (
                    <motion.button
                      key={subsector}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSubsectorToggle(subsector)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        selectedSubsectors.includes(subsector)
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{subsector}</span>
                        {selectedSubsectors.includes(subsector) && (
                          <Check className="w-5 h-5 text-indigo-600" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
                {selectedSubsectors.length > 0 && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={nextStep}
                    className="mt-8 w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Continuer
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </motion.button>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                  Derniers détails
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description de votre activité
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="block w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Décrivez votre activité principale en quelques mots"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type d'activité
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {['B2B', 'B2C'].map((type) => (
                        <motion.button
                          key={type}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData(prev => ({ ...prev, b2b2c: type }))}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                            formData.b2b2c === type
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:border-indigo-300'
                          }`}
                        >
                          <span className="text-sm font-medium text-gray-900">{type}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="mt-8 w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Enregistrement...' : 'Terminer'}
                </motion.button>
              </div>
            )}

            {step > 1 && (
              <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={prevStep}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Retour
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;