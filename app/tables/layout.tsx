import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TableDataProvider } from "@/context/TablesContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TableDataProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-screen">
          <div className="flex justify-between items-center w-full bg-slate-600 text-white gap-2 px-4 py-2.5">
            <SidebarTrigger />
            <h1 className="text-xl tracking-wider font-semibold">
              PiHR Dataset Console
            </h1>
          </div>          
          {children}
        </main>
      </SidebarProvider>
    </TableDataProvider>
  );
}
