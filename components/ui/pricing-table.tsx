"use client"

import * as React from "react"
import { Button } from "./button"
import { cn } from "../../lib/utils"
import { Check, ArrowRight, Minus } from "lucide-react"

export type PlanLevel = "starter" | "pro" | "all" | string

export interface PricingFeature {
  name: string
  included: PlanLevel | null
  values?: Record<string, string>
}

export interface PricingPlan {
  name: string
  level: PlanLevel
  price: {
    monthly: number
    yearly: number
  }
  popular?: boolean
  description?: string
}

export interface PricingTableProps
  extends React.HTMLAttributes<HTMLDivElement> {
  features: PricingFeature[]
  plans: PricingPlan[]
  onPlanSelect?: (plan: PlanLevel) => void
  defaultPlan?: PlanLevel
  defaultInterval?: "monthly" | "yearly"
  containerClassName?: string
  buttonClassName?: string
}

export function PricingTable({
  features,
  plans,
  onPlanSelect,
  defaultPlan = "pro",
  defaultInterval = "monthly",
  className,
  containerClassName,
  buttonClassName,
  ...props
}: PricingTableProps) {
  
  const [selectedPlan, setSelectedPlan] = React.useState<PlanLevel>(defaultPlan)

  const handlePlanSelect = (plan: PlanLevel) => {
    setSelectedPlan(plan)
    onPlanSelect?.(plan)
  }

  return (
    <section
      className={cn(
        "bg-transparent text-slate-900 dark:text-slate-100",
        "py-6 sm:py-12",
        "fade-bottom overflow-hidden pb-0",
      )}
    >
      <div
        className={cn("w-full max-w-4xl mx-auto px-4", containerClassName)}
        {...props}
      >
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          {plans.map((plan) => (
            <button
              key={plan.name}
              type="button"
              onClick={() => handlePlanSelect(plan.level)}
              className={cn(
                "flex-1 p-6 rounded-2xl text-left transition-all duration-300 relative group",
                "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 backdrop-blur-sm",
                selectedPlan === plan.level 
                  ? "ring-2 ring-indigo-500 dark:ring-indigo-400 shadow-xl scale-[1.02] z-10" 
                  : "hover:border-indigo-300 dark:hover:border-indigo-700 opacity-80 hover:opacity-100 hover:scale-[1.01]",
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-serif font-bold tracking-wide">{plan.name}</span>
                {plan.popular && (
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded-full">
                    Best Value
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 h-8 leading-tight">{plan.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold font-serif">
                   €{plan.price.monthly}
                </span>
                <span className="text-xs font-normal text-slate-400 uppercase tracking-widest">
                  / Evento
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/20 shadow-sm">
          <div className="overflow-x-auto">
            <div className="min-w-[640px] divide-y divide-slate-100 dark:divide-slate-800">
              <div className="flex items-center p-5 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex-1 text-xs font-bold uppercase tracking-widest text-slate-500">Funzionalità</div>
                <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
                  {plans.map((plan) => (
                    <div
                      key={plan.level}
                      className="w-24 text-center"
                    >
                      {plan.name}
                    </div>
                  ))}
                </div>
              </div>
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className={cn(
                    "flex items-center p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30",
                    feature.included === selectedPlan &&
                      "bg-indigo-50/50 dark:bg-indigo-900/10",
                  )}
                >
                  <div className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300">{feature.name}</div>
                  <div className="flex items-center gap-8 text-sm">
                    {plans.map((plan) => (
                      <div
                        key={plan.level}
                        className={cn(
                          "w-24 flex justify-center items-center",
                          plan.level === selectedPlan && "font-bold text-slate-900 dark:text-white",
                        )}
                      >
                        {feature.values && feature.values[plan.level] ? (
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 text-center leading-tight">
                                {feature.values[plan.level]}
                            </span>
                        ) : shouldShowCheck(feature.included, plan.level) ? (
                          <div className={`p-1 rounded-full ${plan.level === selectedPlan ? 'bg-indigo-500 text-white' : 'text-indigo-500'}`}>
                             <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-700">
                            <Minus className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className={cn(
              "w-full sm:w-auto px-10 py-6 text-xs font-bold uppercase tracking-widest rounded-lg shadow-xl hover:shadow-indigo-500/20 transition-all",
              buttonClassName,
            )}
          >
            Seleziona {plans.find((p) => p.level === selectedPlan)?.name}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="mt-4 text-[10px] text-slate-400 uppercase tracking-widest">
              Prezzi IVA esclusa. Soggetti a disponibilità.
          </p>
        </div>
      </div>
    </section>
  )
}

function shouldShowCheck(
  included: PricingFeature["included"],
  level: string,
): boolean {
  if (included === "all") return true
  if (included === "pro" && (level === "pro" || level === "all")) return true
  if (
    included === "starter" &&
    (level === "starter" || level === "pro" || level === "all")
  )
    return true
  return false
}
