import React from 'react';
import { ArrowRight, BarChart3, Users, Zap, Check, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-indigo-600" />,
      title: "Génération Automatique",
      description: "Génération de leads qualifiés via Make.com en automatique"
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      title: "Gestion Centralisée",
      description: "Tous vos leads au même endroit, synchronisés avec Airtable"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-indigo-600" />,
      title: "Analytics Avancés",
      description: "Suivez vos performances et optimisez vos conversions"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "0€",
      period: "/mois",
      description: "Parfait pour débuter",
      features: [
        "100 leads/mois",
        "1 utilisateur",
        "Intégration Make.com",
        "Support email"
      ]
    },
    {
      name: "Pro",
      price: "49€",
      period: "/mois",
      description: "Pour les équipes en croissance",
      features: [
        "1000 leads/mois",
        "5 utilisateurs",
        "Intégration Make.com & Airtable",
        "Support prioritaire",
        "Analytics avancés",
        "Export des données"
      ]
    },
    {
      name: "Enterprise",
      price: "199€",
      period: "/mois",
      description: "Pour les grandes entreprises",
      features: [
        "Leads illimités",
        "Utilisateurs illimités",
        "Toutes les intégrations",
        "Support dédié 24/7",
        "API personnalisée",
        "Formation sur mesure"
      ]
    }
  ];

  const testimonials = [
    {
      content: "Cette solution a révolutionné notre processus de génération de leads. Nous avons augmenté nos conversions de 150% en 3 mois.",
      author: "Marie Dubois",
      role: "Directrice Marketing, TechCorp"
    },
    {
      content: "L'intégration avec Make.com est parfaite. Nous avons automatisé tout notre processus de prospection.",
      author: "Jean Martin",
      role: "CEO, StartupFlow"
    },
    {
      content: "Le meilleur investissement que nous ayons fait cette année. Le ROI est exceptionnel.",
      author: "Sophie Bernard",
      role: "Sales Manager, GrowthCo"
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-200 to-indigo-800 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Générez et Gérez vos Leads Automatiquement
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Automatisez votre prospection avec notre solution intégrée à Make.com et Airtable. Générez, qualifiez et suivez vos leads en un seul endroit.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/register" className="rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Commencer Gratuitement
              </Link>
              <Link to="/login" className="text-lg font-semibold leading-6 text-gray-900 hover:text-indigo-600">
                Se Connecter <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Gestion de Leads Simplifiée</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Tout ce dont vous avez besoin pour gérer vos leads
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.title} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                      {feature.icon}
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Témoignages</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ce que nos clients disent
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">{testimonial.content}</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Tarifs</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Des prix adaptés à vos besoins
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-1">{plan.period}</span>
                </div>
                <p className="mt-2 text-gray-500">{plan.description}</p>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="w-5 h-5 text-indigo-600 mr-2" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-8 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                  Commencer
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-indigo-600 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Prêt à transformer votre prospection?
            </h2>
            <p className="mt-6 text-lg leading-8 text-indigo-100">
              Rejoignez les entreprises qui ont déjà automatisé leur génération de leads avec notre solution.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/register" className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50">
                Commencer Gratuitement
              </Link>
              <Link to="/contact" className="text-lg font-semibold leading-6 text-white hover:text-indigo-100">
                Contactez-nous <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;