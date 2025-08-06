import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, Sheet } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Leads',
        href: '/leads',
        icon: LayoutGrid,
    },{
        title: 'Products',
        href: '/products',
        icon: Folder,
    },{
        title: 'Deal Pipeline',
        href: '/deal-pipeline',
        icon: BookOpen,
    },{
        title: 'Customers',
        href: '/customers',
        icon: Users,
    },{
        title: 'Report',
        href: '/report',
        icon: Sheet,
    },
];

;

export function AppSidebar() {
    return (
        <Sidebar collapsible="offcanvas" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                {/*<AppLogo />*/} CRM DWP
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
