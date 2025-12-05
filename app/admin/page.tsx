import AdminDashboard from '@/components/admin/Dashboard/AdminDashboard'
import RoleProtected from '@/components/protected/role-protected'

const page = () => {
  return (
        <RoleProtected allowedRoles={['admin']}>
      <AdminDashboard/>
        </RoleProtected>
  )
}

export default page
