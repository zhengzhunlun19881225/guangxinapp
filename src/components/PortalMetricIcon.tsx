import React from 'react';
import { HandCoins, ChartNoAxesCombined, Landmark, WalletCards, BadgePercent } from 'lucide-react';
// Financial KPIs share the existing Lucide outline family and content colors.
const icons={revenue:HandCoins,profit:ChartNoAxesCombined,assets:Landmark,net:WalletCards,tax:BadgePercent};
export function PortalMetricIcon({kind,className=''}:{kind:keyof typeof icons;className?:string}){
 const Icon=icons[kind];
 return <Icon className={`portal-metric-icon ${className}`} data-metric-icon={kind} data-icon-style="outline" strokeWidth={1.8} aria-hidden="true"/>;
}
