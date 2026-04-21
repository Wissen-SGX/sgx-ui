import { useState } from 'react';
import { NavLink } from 'react-router';
import { ChevronLeft, ChevronRight, ChevronDown, LayoutGrid } from 'lucide-react';

import { SidebarProps } from '@layout/types/layout.types';
import { getSidebarWidthClass } from '@layout/utils/layout.helpers';
import { MENU_ITEMS } from '@layout/config/navigation';
import { SimpleTooltip } from '@layout/utils/SimpleTooltip';

import sgxLogo from '@layout/assets/sgxLogo.png';
import sgxLogoCollapsed from '@layout/assets/sgxLogoCollapsed.png';

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const [openSections, setOpenSections] = useState<string[]>([
    '/backtest',
    '/parameters',
    '/settings',
  ]);

  const toggleSection = (path: string) => {
    setOpenSections((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  return (
    <aside
      className={`min-h-screen flex flex-col transition-all duration-300 relative bg-sgx-blue ${getSidebarWidthClass(
        isCollapsed
      )}`}
    >
      {/* Logo */}
      <div className="p-6 flex items-center justify-between" style={{ height: '72px' }}>
        {!isCollapsed && (
          <div>
            <img src={sgxLogo} alt="SGX Group" className="h-8" />
            <div className="text-xs text-gray-400 mt-1">Index Management</div>
          </div>
        )}
        {isCollapsed && <img src={sgxLogoCollapsed} alt="SGX Group" className="h-8 mx-auto" />}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-4">
        {MENU_ITEMS.map((item) => {
          const isSectionOpen = openSections.includes(item.path);

          return (
            <div key={item.path} className="mb-2">
              {isCollapsed ? (
                <SimpleTooltip content={item.label} placement="right">
                  <button
                    onClick={() => toggleSection(item.path)}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-[#0d1b3a]"
                    title={isCollapsed ? item.label : ''}
                  >
                    <item.icon size={20} style={{ color: '#ffffff', flexShrink: 0 }} />
                  </button>
                </SimpleTooltip>
              ) : (
                <button
                  onClick={() => toggleSection(item.path)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all hover:bg-[#0d1b3a]"
                  title={isCollapsed ? item.label : ''}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <item.icon size={20} style={{ color: '#ffffff', flexShrink: 0 }} />
                    {!isCollapsed && (
                      <div className="font-medium text-sm text-white">{item.label}</div>
                    )}
                  </div>
                  {!isCollapsed && (
                    <div className="flex items-center gap-2">
                      {item.count && (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium"
                          style={{ backgroundColor: '#0094B3', color: '#ffffff' }}
                        >
                          {item.count}
                        </div>
                      )}
                      <ChevronDown
                        size={16}
                        style={{
                          color: '#ffffff',
                          transform: isSectionOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                          transition: 'transform 0.2s',
                        }}
                      />
                    </div>
                  )}
                </button>
              )}

              {/* Sub-items */}
              {!isCollapsed && item.subItems && isSectionOpen && (
                <div className="ml-4 mt-1 space-y-1 border-l-2" style={{ borderColor: '#1a3a6b' }}>
                  {item.subItems.map((subItem) => (
                    <NavLink
                      key={subItem.path}
                      to={subItem.path}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ml-4 ${
                          isActive ? '' : 'hover:bg-[#0d1b3a]'
                        }`
                      }
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? '#0094B3' : 'transparent',
                        color: isActive ? '#0B236B' : '#9ca3af',
                        fontWeight: isActive ? '500' : '400',
                      })}
                    >
                      {({ isActive }) => (
                        <>
                          <subItem.icon
                            size={18}
                            style={{
                              color: isActive ? '#0B236B' : '#9ca3af',
                              flexShrink: 0,
                            }}
                          />
                          {subItem.label}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="pb-6"></div>

      {/* Toggle Button */}
      <button
        onClick={() => onToggle(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ backgroundColor: '#0094B3' }}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight size={16} className="text-white" />
        ) : (
          <ChevronLeft size={16} className="text-white" />
        )}
      </button>
    </aside>
  );
}
