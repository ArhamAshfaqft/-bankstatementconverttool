import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ChasePage from './pages/ChasePage';
import BofAPage from './pages/BofAPage';
import WellsFargoPage from './pages/WellsFargoPage';
import CitiPage from './pages/CitiPage';
import CapitalOnePage from './pages/CapitalOnePage';
import PricingPage from './pages/PricingPage';
import MergePage from './pages/MergePage';
import QboPage from './pages/QboPage';
import CreditCardPage from './pages/CreditCardPage';
import SplitPage from './pages/SplitPage';
import RedactPage from './pages/RedactPage';
import ReceiptPage from './pages/ReceiptPage';
import LoginPage from './pages/LoginPage';
import SuccessPage from './pages/SuccessPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="chase" element={<ChasePage />} />
        <Route path="bank-of-america" element={<BofAPage />} />
        <Route path="wells-fargo" element={<WellsFargoPage />} />
        <Route path="citibank" element={<CitiPage />} />
        <Route path="capital-one" element={<CapitalOnePage />} />
        <Route path="quickbooks-qbo-converter" element={<QboPage />} />
        <Route path="credit-card-parser" element={<CreditCardPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="merge" element={<MergePage />} />
        <Route path="split" element={<SplitPage />} />
        <Route path="redact" element={<RedactPage />} />
        <Route path="receipt-scanner" element={<ReceiptPage />} />
        <Route path="success" element={<SuccessPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
