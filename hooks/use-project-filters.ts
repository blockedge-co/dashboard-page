"use client";

import { useMemo } from 'react';
import { useDebouncedFilter } from './use-debounced-filter';
import type { ProjectData } from '@/lib/co2e-api';

export interface FilterConfig {
  type: string;
  registry: string;
  search?: string;
  status?: string;
  country?: string;
  methodology?: string;
}

export interface FilterFunctions {
  byType: (project: ProjectData, type: string) => boolean;
  byRegistry: (project: ProjectData, registry: string) => boolean;
  bySearch?: (project: ProjectData, search: string) => boolean;
  byStatus?: (project: ProjectData, status: string) => boolean;
  byCountry?: (project: ProjectData, country: string) => boolean;
  byMethodology?: (project: ProjectData, methodology: string) => boolean;
}

export function useProjectFilters(
  projects: ProjectData[],
  filters: FilterConfig,
  debounceDelay: number = 300
) {
  // Memoized filter functions for better performance
  const filterFunctions = useMemo<FilterFunctions>(
    () => ({
      byType: (project: ProjectData, type: string) => {
        if (type === "all") return true;
        
        const projectType = project.type.toLowerCase();
        
        switch (type) {
          case "renewable":
            return (
              projectType.includes("renewable") ||
              projectType.includes("energy") ||
              projectType.includes("solar") ||
              projectType.includes("wind") ||
              projectType.includes("hydropower")
            );
          case "forest":
            return (
              projectType.includes("forest") ||
              projectType.includes("conservation") ||
              projectType.includes("afforestation") ||
              projectType.includes("reforestation")
            );
          case "industrial":
            return (
              projectType.includes("industrial") ||
              projectType.includes("efficiency") ||
              projectType.includes("manufacturing")
            );
          case "transport":
            return (
              projectType.includes("transport") ||
              projectType.includes("mobility") ||
              projectType.includes("vehicle")
            );
          case "agriculture":
            return (
              projectType.includes("agriculture") ||
              projectType.includes("farming") ||
              projectType.includes("crop")
            );
          default:
            return projectType.includes(type.toLowerCase());
        }
      },
      
      byRegistry: (project: ProjectData, registry: string) => {
        if (registry === "all") return true;
        if (!project.registry) return false;
        
        const projectRegistry = project.registry.toLowerCase();
        
        switch (registry) {
          case "verra":
            return projectRegistry.includes("verra");
          case "tuv-sud":
            return (
              projectRegistry.includes("tuv") || 
              projectRegistry.includes("sud") ||
              projectRegistry.includes("tüv")
            );
          case "dnv":
            return (
              projectRegistry.includes("dnv") ||
              projectRegistry.includes("det norske veritas")
            );
          case "irec":
            return (
              projectRegistry.includes("irec") ||
              projectRegistry.includes("i-rec") ||
              projectRegistry.includes("international rec")
            );
          case "gold-standard":
            return (
              projectRegistry.includes("gold") ||
              projectRegistry.includes("standard")
            );
          default:
            return projectRegistry.includes(registry.toLowerCase());
        }
      },
      
      bySearch: (project: ProjectData, search: string) => {
        if (!search.trim()) return true;
        
        const searchLower = search.toLowerCase();
        return (
          project.name.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.location.toLowerCase().includes(searchLower) ||
          project.country.toLowerCase().includes(searchLower) ||
          project.type.toLowerCase().includes(searchLower) ||
          project.registry.toLowerCase().includes(searchLower) ||
          project.methodology.toLowerCase().includes(searchLower) ||
          project.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      },
      
      byStatus: (project: ProjectData, status: string) => {
        if (status === "all") return true;
        return project.status === status;
      },
      
      byCountry: (project: ProjectData, country: string) => {
        if (country === "all") return true;
        return project.country.toLowerCase() === country.toLowerCase();
      },
      
      byMethodology: (project: ProjectData, methodology: string) => {
        if (methodology === "all") return true;
        return project.methodology.toLowerCase() === methodology.toLowerCase();
      },
    }),
    []
  );

  // Use debounced filtering for better performance
  const filteredProjects = useDebouncedFilter(
    projects,
    filters,
    filterFunctions,
    debounceDelay
  );

  // Generate filter options based on available data
  const filterOptions = useMemo(() => {
    const types = new Set<string>();
    const registries = new Set<string>();
    const statuses = new Set<string>();
    const countries = new Set<string>();
    const methodologies = new Set<string>();

    projects.forEach(project => {
      // Extract type categories
      if (project.type) {
        const type = project.type.toLowerCase();
        if (type.includes("renewable") || type.includes("energy")) {
          types.add("renewable");
        }
        if (type.includes("forest") || type.includes("conservation")) {
          types.add("forest");
        }
        if (type.includes("industrial") || type.includes("efficiency")) {
          types.add("industrial");
        }
        if (type.includes("transport") || type.includes("mobility")) {
          types.add("transport");
        }
        if (type.includes("agriculture") || type.includes("farming")) {
          types.add("agriculture");
        }
      }

      // Extract registries
      if (project.registry) {
        const registry = project.registry.toLowerCase();
        if (registry.includes("verra")) registries.add("verra");
        if (registry.includes("tuv") || registry.includes("sud")) registries.add("tuv-sud");
        if (registry.includes("dnv")) registries.add("dnv");
        if (registry.includes("irec") || registry.includes("i-rec")) registries.add("irec");
        if (registry.includes("gold")) registries.add("gold-standard");
      }

      // Extract other filter options
      if (project.status) statuses.add(project.status);
      if (project.country) countries.add(project.country);
      if (project.methodology) methodologies.add(project.methodology);
    });

    return {
      types: Array.from(types).sort(),
      registries: Array.from(registries).sort(),
      statuses: Array.from(statuses).sort(),
      countries: Array.from(countries).sort(),
      methodologies: Array.from(methodologies).sort(),
    };
  }, [projects]);

  // Filter statistics
  const filterStats = useMemo(() => {
    const totalProjects = projects.length;
    const filteredCount = filteredProjects.length;
    const filterRate = totalProjects > 0 ? (filteredCount / totalProjects) * 100 : 0;

    return {
      total: totalProjects,
      filtered: filteredCount,
      filterRate: Math.round(filterRate),
      hasActiveFilters: (
        filters.type !== "all" ||
        filters.registry !== "all" ||
        (filters.search && filters.search.trim() !== "") ||
        (filters.status && filters.status !== "all") ||
        (filters.country && filters.country !== "all") ||
        (filters.methodology && filters.methodology !== "all")
      ),
    };
  }, [projects, filteredProjects, filters]);

  return {
    filteredProjects,
    filterOptions,
    filterStats,
    filterFunctions,
  };
}