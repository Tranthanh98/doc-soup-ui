// TODO: Create migration to save the plantier features
const mockUpLimitedFeatures = (plans) => {
  const personalFeatures = [{ name: 'Document Only' }, { name: 'Limited eSignature', desciption: '4 links/user/mo' }];

  const standardFeatures = [
    { name: 'Spaces' },
    { name: 'Unlimited eSignature' },
    { name: 'Custom branding' },
    { name: 'Team reporting' },
    { name: 'All content types' },
    { name: 'CRM integration available' },
  ];

  const advancedFeatures = [
    { name: 'First 3 users free', desciption: 'Additional users at $@price/user/mo' },
    { name: 'Deal Spaces' },
    { name: 'Unlimited eSignature & One-click NDA' },
    { name: 'Enhanced security' },
    { name: 'Watermarking' },
    { name: 'Restricted viewer access' },
    { name: 'Verified visitors' },
    { name: 'CRM integration available' },
  ];

  return plans.map((plan) => {
    if (plan.name === 'Personal') {
      return { ...plan, features: personalFeatures };
    }
    if (plan.name === 'Standard') {
      return { ...plan, features: standardFeatures };
    }

    if (plan.name === 'Advanced') {
      return { ...plan, features: advancedFeatures };
    }

    return { ...plan, features: [] };
  });
};

export default mockUpLimitedFeatures;
