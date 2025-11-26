import { ResponsiveSidebar } from "@/components/students/ResponsiveSidebar"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <ResponsiveSidebar />
      <main className="md:pl-64 pb-20 md:pb-0"> {/* Desktop sidebar width + mobile bottom nav padding */}
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}