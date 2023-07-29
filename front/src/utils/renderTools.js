const renderIcon = (entry, accountType, canModifyPrimary) => {
    let icon
    if (canModifyPrimary && accountType) {
      if (entry.primary) icon = '🔘'
      else if (accountType == 'free') icon = '❌'
      else if (accountType == 'subscriber') icon = '✅'

      return <span className="is-primary">{icon}</span>
    }
  }

  export default renderIcon