export default function CustomButton({ children, onClick, variant = 'default', className }) {
    return (
      <Button onClick={onClick} variant={variant} className={className}>
        {children}
      </Button>
    )
  }