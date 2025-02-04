import * as React from "react"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (props, ref) => (
    <div
      ref={ref}
      className="rounded-lg border bg-white text-gray-950 shadow-sm"
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  (props, ref) => (
    <div ref={ref} className="p-6" {...props} />
  )
)
CardContent.displayName = "CardContent"

const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  (props, ref) => (
    <div ref={ref} className="flex flex-col space-y-1.5 p-6" {...props} />
  )
)
CardHeader.displayName = "CardHeader"

export { Card, CardHeader, CardContent }
