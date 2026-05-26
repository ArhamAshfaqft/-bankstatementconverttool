import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ChasePage from './pages/ChasePage';
import BofAPage from './pages/BofAPage';
import WellsFargoPage from './pages/WellsFargoPage';
import CitiPage from './pages/CitiPage';
import CapitalOnePage from './pages/CapitalOnePage';
import PncPage from './pages/PncPage';
import TdPage from './pages/TdPage';
import AmexPage from './pages/AmexPage';
import PdfToExcelPage from './pages/PdfToExcelPage';
import PricingPage from './pages/PricingPage';
import MergePage from './pages/MergePage';
import SplitPage from './pages/SplitPage';
import RedactPage from './pages/RedactPage';
import ReceiptPage from './pages/ReceiptPage';
import DecryptPage from './pages/DecryptPage';
import ProtectPage from './pages/ProtectPage';
import AuditPage from './pages/AuditPage';
import QboPage from './pages/QboPage';
import OfxPage from './pages/OfxPage';
import VisualizerPage from './pages/VisualizerPage';
import CreditCardPage from './pages/CreditCardPage';
import LoginPage from './pages/LoginPage';
import SuccessPage from './pages/SuccessPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import QboToCsvPage from './pages/QboToCsvPage';
import CsvToQboPage from './pages/CsvToQboPage';
import QifToQboPage from './pages/QifToQboPage';


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
        <Route path="pnc" element={<PncPage />} />
        <Route path="td-bank" element={<TdPage />} />
        <Route path="american-express" element={<AmexPage />} />
        <Route path="pdf-to-excel-converter" element={<PdfToExcelPage />} />
        <Route path="quickbooks-qbo-converter" element={<QboPage />} />
        <Route path="ofx-converter" element={<OfxPage />} />
        <Route path="visualizer" element={<VisualizerPage />} />
        <Route path="credit-card-parser" element={<CreditCardPage />} />
        <Route path="qbo-to-csv-converter" element={<QboToCsvPage />} />
        <Route path="csv-to-qbo-converter" element={<CsvToQboPage />} />
        <Route path="qif-to-qbo-converter" element={<QifToQboPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="merge" element={<MergePage />} />
        <Route path="split" element={<SplitPage />} />
        <Route path="redact" element={<RedactPage />} />
        <Route path="receipt-scanner" element={<ReceiptPage />} />
        <Route path="unlock-pdf" element={<DecryptPage />} />
        <Route path="protect-pdf" element={<ProtectPage />} />
        <Route path="audit-statement" element={<AuditPage />} />
        <Route path="success" element={<SuccessPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
