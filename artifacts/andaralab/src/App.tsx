import { Switch, Route } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import DataHubPage from "@/pages/DataHubPage";
import AdminPage from "@/pages/AdminPage";
import {
  MacroOutlooksPage,
  PolicyMonetaryPage,
  GeopoliticalPage,
  DeepDivesPage,
  RegionalPage,
  ESGPage,
  BlogPage,
} from "@/pages/SectionPage";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Navbar />
      <main className="pt-14">{children}</main>
      <Footer />
    </div>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}

export default function App() {
  return (
    <Switch>
      <Route path="/admin">
        <AdminLayout>
          <AdminPage />
        </AdminLayout>
      </Route>
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/contact" component={ContactPage} />

            <Route path="/macro/macro-outlooks" component={MacroOutlooksPage} />
            <Route path="/macro/policy-monetary" component={PolicyMonetaryPage} />
            <Route path="/macro/geopolitical" component={GeopoliticalPage} />

            <Route path="/sectoral/deep-dives" component={DeepDivesPage} />
            <Route path="/sectoral/regional" component={RegionalPage} />
            <Route path="/sectoral/esg" component={ESGPage} />

            <Route path="/data" component={DataHubPage} />
            <Route path="/data/economic-calendar" component={DataHubPage} />
            <Route path="/data/market-dashboard" component={DataHubPage} />

            <Route path="/blog/economics-101">
              <BlogPage sub="economics-101" />
            </Route>
            <Route path="/blog/market-pulse">
              <BlogPage sub="market-pulse" />
            </Route>
            <Route path="/blog/lab-notes">
              <BlogPage sub="lab-notes" />
            </Route>

            <Route>
              <div className="max-w-[1200px] mx-auto px-6 py-24 text-center">
                <div className="text-[72px] font-bold text-gray-100 mb-4">404</div>
                <h1 className="text-[24px] font-semibold text-gray-900 mb-3">Page not found</h1>
                <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
                <a href="/" className="text-[13.5px] font-medium text-white bg-[#1a3a5c] px-6 py-2.5">
                  Go Home
                </a>
              </div>
            </Route>
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}
