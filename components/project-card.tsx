"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { MapPin, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAnimationProps } from "@/hooks/use-performance"

interface ProjectCardProps {
  project: any
  index: number
  onViewDetails: (project: any) => void
}

const ProjectCard = memo(function ProjectCard({ project, index, onViewDetails }: ProjectCardProps) {
  const animationProps = useAnimationProps()

  return (
    <motion.div
      key={project.id}
      initial={animationProps.initial}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      whileHover={animationProps.whileHover}
    >
      <Card className="bg-slate-800/80 border-slate-700/50 overflow-hidden hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg text-white">{project.name}</CardTitle>
              <CardDescription className="text-slate-400">{project.type}</CardDescription>
              <div className="flex items-center gap-1 mt-2">
                <MapPin className="w-3 h-3 text-slate-300" />
                <span className="text-xs text-slate-300">{project.location}</span>
              </div>
            </div>

          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Current Supply</span>
              <p className="font-semibold text-white">{project.co2Reduction?.total ? 
                  `${parseInt(project.co2Reduction.total).toLocaleString()} Tokens` : 
                  project.impact || "N/A"
                }</p>
            </div>
            <div>
              <span className="text-slate-500">CO2 Impact</span>
              <p className="font-semibold text-white">
                {project.co2Reduction?.total ? 
                  `${parseInt(project.co2Reduction.total).toLocaleString()}` : 
                  project.impact || "N/A"
                }
              </p>
            </div>

          </div>

          <div>
            <span className="text-sm text-slate-500">Compliance</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {(project.compliance || ["EU Taxonomy", "TCFD"]).map((badge: string) => (
                <Badge
                  key={badge}
                  variant="outline"
                  className="text-xs bg-slate-700/50 text-slate-300 border-slate-600"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <span className="text-sm text-slate-500">Registry</span>
            <p className="text-sm font-medium mt-1 text-slate-300">
              {project.registry || project.certificationBody || "Verified Registry"}
            </p>
          </div>

          <div>
            <span className="text-sm text-slate-500">Methodology</span>
            <p className="text-sm font-medium mt-1 text-slate-300">
              {project.methodology || project.backing || "IREC Standard"}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              onClick={() => onViewDetails(project)}
            >
              <Eye className="w-3 h-3 mr-1" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
})

export default ProjectCard