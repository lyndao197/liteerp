import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import KanbanBoard from './components/KanbanBoard';
import LeadForm from './components/LeadForm';
import OpportunityBoard from './components/OpportunityBoard';
import OpportunityForm from './components/OpportunityForm';
import BusinessPlanForm from './components/BusinessPlanForm';
import QuoteForm from './components/QuoteForm';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import ActivityBoard from './components/ActivityBoard';
import ActivityForm from './components/ActivityForm';
import ContractManagement from './components/ContractManagement';
import ContractForm from './components/ContractForm';
import OrderManagement from './components/OrderManagement';
import OrderForm from './components/OrderForm';
import GoalList from './components/GoalList';
import GoalForm from './components/GoalForm';
import PersonalDashboard from './components/PersonalDashboard';
import InboundBillingList from './components/InboundBillingList';
import InboundBillingForm from './components/InboundBillingForm';
import OutboundBillingList from './components/OutboundBillingList';
import OutboundBillingForm from './components/OutboundBillingForm';
import ReportDashboard from './components/ReportDashboard';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import RoleList from './components/RoleList';
import RoleForm from './components/RoleForm';
import MarketingCampaignList from './components/MarketingCampaignList';
import ServiceTicketList from './components/ServiceTicketList';
import LoyaltyProgramList from './components/LoyaltyProgramList';
import ProductList from './components/ProductList';
import DebtManagement from './components/DebtManagement';
import ProjectList from './components/ProjectList';
import ProjectTaskBoard from './components/ProjectTaskBoard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="layout">
        <Sidebar />
        <div className="main-wrapper">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<OpportunityBoard />} />
              <Route path="/dashboard" element={<PersonalDashboard />} />
              <Route path="/lead/new" element={<LeadForm />} />
              <Route path="/lead/edit/:id" element={<LeadForm />} />
              <Route path="/opportunity" element={<OpportunityBoard />} />
              <Route path="/opportunity/new" element={<OpportunityForm />} />
              <Route path="/opportunity/edit/:id" element={<OpportunityForm />} />
              <Route path="/opportunity/:id/pakd/new" element={<BusinessPlanForm />} />
              <Route path="/opportunity/:id/quote/new" element={<QuoteForm />} />
              <Route path="/customers" element={<CustomerList />} />
              <Route path="/customer/new" element={<CustomerForm />} />
              <Route path="/customer/edit/:id" element={<CustomerForm />} />
              <Route path="/contacts" element={<ContactList />} />
              <Route path="/contact/new" element={<ContactForm />} />
              <Route path="/contact/edit/:id" element={<ContactForm />} />
              <Route path="/activities" element={<ActivityBoard />} />
              <Route path="/activity/new" element={<ActivityForm />} />
              <Route path="/activity/edit/:id" element={<ActivityForm />} />
              <Route path="/contracts" element={<ContractManagement />} />
              <Route path="/contracts/solution" element={<ContractManagement />} />
              <Route path="/contracts/service" element={<ContractManagement />} />
              <Route path="/projects" element={<ProjectList />} />
              <Route path="/projects/:id" element={<ProjectTaskBoard />} />
              <Route path="/contract/new" element={<ContractForm />} />
              <Route path="/contract/edit/:id" element={<ContractForm />} />
              <Route path="/orders" element={<OrderManagement />} />
              <Route path="/order/new" element={<OrderForm />} />
              <Route path="/order/edit/:id" element={<OrderForm />} />
              <Route path="/goals" element={<GoalList />} />
              <Route path="/goal/new" element={<GoalForm />} />
              <Route path="/goal/edit/:id" element={<GoalForm />} />
              <Route path="/billing/in" element={<InboundBillingList />} />
              <Route path="/billing/in/new" element={<InboundBillingForm />} />
              <Route path="/billing/in/edit/:id" element={<InboundBillingForm />} />
              <Route path="/billing/out" element={<OutboundBillingList />} />
              <Route path="/billing/out/new" element={<OutboundBillingForm />} />
              <Route path="/billing/out/edit/:id" element={<OutboundBillingForm />} />
              <Route path="/reports" element={<ReportDashboard />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/user/new" element={<UserForm />} />
              <Route path="/user/edit/:id" element={<UserForm />} />
              <Route path="/roles" element={<RoleList />} />
              <Route path="/role/new" element={<RoleForm />} />
              <Route path="/role/edit/:id" element={<RoleForm />} />
              <Route path="/marketing" element={<MarketingCampaignList />} />
              <Route path="/ticketing" element={<ServiceTicketList />} />
              <Route path="/loyalty" element={<LoyaltyProgramList />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/debt" element={<DebtManagement />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
