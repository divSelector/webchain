const renderIcon = (entry, authAccount, canModifyPrimary) => {
    let icon
    if (canModifyPrimary && authAccount) {
      if (entry.primary) icon = '🔘'
      else if (authAccount.account_type == 'free') icon = '❌'
      else if (authAccount.account_type == 'subscriber') icon = '✅'

      return <span className="is-primary">{icon}</span>
    }
  }

  export default renderIcon