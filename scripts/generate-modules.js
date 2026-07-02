/**
 * Script to generate modules for simple placeholder admin pages
 * This helps create modules for pages that follow the same pattern
 */

const fs = require('fs');
const path = require('path');

// Map of page paths to module paths and titles
const pageModuleMap = [
  // Exams
  { page: 'admin/exams/schedule', module: 'admin/exams/schedule/ExamSchedule', title: 'Exam Schedule' },
  { page: 'admin/exams/marks-entry', module: 'admin/exams/marks-entry/MarksEntry', title: 'Marks Entry' },
  { page: 'admin/exams/results', module: 'admin/exams/results/ExamResults', title: 'Exam Results' },
  { page: 'admin/exams/moderation', module: 'admin/exams/moderation/ExamModeration', title: 'Exam Moderation' },
  { page: 'admin/exams/analytics', module: 'admin/exams/analytics/ExamAnalytics', title: 'Exam Analytics' },
  // Add more mappings as needed
];

function generateModule(modulePath, title, message) {
  const moduleDir = path.join(__dirname, '..', 'modules', path.dirname(modulePath));
  const moduleFile = path.join(moduleDir, path.basename(modulePath) + '.tsx');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(moduleDir)) {
    fs.mkdirSync(moduleDir, { recursive: true });
  }
  
  const componentName = path.basename(modulePath);
  const content = `/**
 * ${title} Module
 * Feature container for ${title.toLowerCase()} page
 */

import AuthGuard from '@/components/guards/AuthGuard';
import RoleGuard from '@/components/guards/RoleGuard';
import AdminLayout from '@/components/layouts/AdminLayout';
import EmptyState from '@/components/ui/EmptyState';
import { UserRole } from '@/utils/types';

export default function ${componentName}() {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[UserRole.SCHOOL_ADMIN]}>
        <AdminLayout>
          <div>
            <h1 className="text-3xl font-bold mb-6">${title}</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <EmptyState message="${message}" />
            </div>
          </div>
        </AdminLayout>
      </RoleGuard>
    </AuthGuard>
  );
}
`;
  
  fs.writeFileSync(moduleFile, content);
  console.log(`Generated: ${moduleFile}`);
}

// Generate modules
pageModuleMap.forEach(({ module, title, message }) => {
  generateModule(module, title, message || `${title} management will be available here.`);
});

console.log('Module generation complete!');
