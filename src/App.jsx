import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LayoutWithSidebar from './LayoutWithSidebar';
import './index.css';
import Login from './pages/Auth/login';
import Dashboard from './pages/dashboard/ViewDashboard';
import MDFinancial from './pages/md/md-financial';
import MDRate from './pages/md/md-rate';
import MDTools from './pages/md/md-tools';
import MDNonTranslation from './pages/md/vif/md-nontranslation';
import MDTranslation from './pages/md/vif/md-translation';
import MDVendor from './pages/md/vif/md-vendor';
import RecordLog from './pages/rl/ViewRL';
import RMNonTranslationAttachment from './pages/rm/rm-nontranslation/AddAttachment-NT';
import RMNonTranslationAdd from './pages/rm/rm-nontranslation/AddRM-NT';
import RMNTEdit from './pages/rm/rm-nontranslation/EditRM-NT';
import NTPMNotes from './pages/rm/rm-nontranslation/PMNotes-NT';
import RMNTShow from './pages/rm/rm-nontranslation/ShowRM-NT';
import NTSubmitRating from './pages/rm/rm-nontranslation/SubmitRating-NT';
import RMNonTranslation from './pages/rm/rm-nontranslation/ViewRM-NT';
import RMTranslationAttachment from './pages/rm/rm-translation/AddAttachment-T';
import RMTranslationAdd from './pages/rm/rm-translation/AddRM-T';
import RMTEdit from './pages/rm/rm-translation/EditRM-T';
import TPMNotes from './pages/rm/rm-translation/PMNotes-T';
import RMTShow from './pages/rm/rm-translation/ShowRM-T';
import TSubmitRating from './pages/rm/rm-translation/SubmitRating-T';
import RMTranslation from './pages/rm/rm-translation/ViewRM-T';
import RMVendorAttachment from './pages/rm/rm-vendor/AddAttachment-V';
import RMVendorAdd from './pages/rm/rm-vendor/AddRM-V';
import RMVEdit from './pages/rm/rm-vendor/EditRM-V';
import VPMNotes from './pages/rm/rm-vendor/PMNotes-V';
import RMVShow from './pages/rm/rm-vendor/ShowRM-V';
import VSubmitRating from './pages/rm/rm-vendor/SubmitRating-V';
import RMVendor from './pages/rm/rm-vendor/ViewRM-V';
import SystemAdminAdd from './pages/sa/AddSA';
import SystemAdminEdit from './pages/sa/EditSA';
import SystemAdmin from './pages/sa/ViewSA';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
      setUserRole(user.role);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
        {userRole && (
          <>
            <Route element={<LayoutWithSidebar />}>
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Master Data */}
              <Route path="/master-data/vendor" element={<MDVendor />} />
              <Route
                path="/master-data/translation"
                element={<MDTranslation />}
              />
              <Route
                path="/master-data/non-translation"
                element={<MDNonTranslation />}
              />
              <Route path="/master-data/rate-type" element={<MDRate />} />
              <Route path="/master-data/tools" element={<MDTools />} />
              <Route
                path="/master-data/financial-directory"
                element={<MDFinancial />}
              />
              {/* Resource Manager - Translation */}
              <Route
                path="/resource-manager/translation"
                element={<RMTranslation />}
              />
              <Route
                path="/resource-manager/translation/add"
                element={<RMTranslationAdd />}
              />
              <Route
                path="/resource-manager/translation/submit-rating/:id"
                element={<TSubmitRating />}
              />
              <Route
                path="/resource-manager/translation/PM-notes/:id"
                element={<TPMNotes />}
              />
              <Route
                path="/resource-manager/translation/:id/show"
                element={<RMTShow />}
              />
              <Route
                path="/resource-manager/translation/:id/edit"
                element={<RMTEdit />}
              />
              <Route
                path="/resource-manager/translation/:id/attachments"
                element={<RMTranslationAttachment />}
              />
              {/* Resource Manager - Non Translation */}
              <Route
                path="/resource-manager/non-translation"
                element={<RMNonTranslation />}
              />
              <Route
                path="/resource-manager/non-translation/add"
                element={<RMNonTranslationAdd />}
              />
              <Route
                path="/resource-manager/non-translation/submit-rating/:id"
                element={<NTSubmitRating />}
              />
              <Route
                path="/resource-manager/non-translation/PM-notes/:id"
                element={<NTPMNotes />}
              />
              <Route
                path="/resource-manager/non-translation/:id/show"
                element={<RMNTShow />}
              />
              <Route
                path="/resource-manager/non-translation/:id/edit"
                element={<RMNTEdit />}
              />
              <Route
                path="/resource-manager/non-translation/:id/attachments"
                element={<RMNonTranslationAttachment />}
              />
              {/* Resource Manager - Vendor */}
              <Route path="/resource-manager/vendor" element={<RMVendor />} />
              <Route
                path="/resource-manager/vendor/add"
                element={<RMVendorAdd />}
              />
              <Route
                path="/resource-manager/vendor/submit-rating/:id"
                element={<VSubmitRating />}
              />
              <Route
                path="/resource-manager/vendor/PM-notes/:id"
                element={<VPMNotes />}
              />
              <Route
                path="/resource-manager/vendor/:id/show"
                element={<RMVShow />}
              />
              <Route
                path="/resource-manager/vendor/:id/edit"
                element={<RMVEdit />}
              />
              <Route
                path="/resource-manager/vendor/:id/attachments"
                element={<RMVendorAttachment />}
              />
              {/* System administrator */}
              {userRole === 'Superadmin' && (
                <>
                  <Route
                    path="/system-administrator"
                    element={<SystemAdmin />}
                  />
                  <Route
                    path="/system-administrator/add"
                    element={<SystemAdminAdd />}
                  />
                  <Route
                    path="/system-administrator/edit/:id"
                    element={<SystemAdminEdit />}
                  />
                  <Route path="/record-log" element={<RecordLog />} />
                </>
              )}
            </Route>
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
