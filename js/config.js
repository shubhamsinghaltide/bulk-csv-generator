// Tab definitions: one entry per upload screen in tide-web-apps.
// To add a screen, add an entry here; nothing else needs to change.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const TABS = {
  cancel: {
    screen: 'Bulk Cancel Subscription',
    filePrefix: 'create_cancellation_bulk_request',
    seqKeyPrefix: 'bulkCancelSeq',
    columns: ['BusinessId', 'BundleId', 'SubscriptionId'],
    uuidColumns: ['BundleId', 'SubscriptionId'],
    placeholder: [
      '93344\t5fc03ba6-b9c1-47a2-9a98-3efb8ffb8efd\t050b325f-a037-48d3-bec4-2e2a8feb5ca9',
      '93355\t5fc03ba6-b9c1-47a2-9a98-3efb8ffb8efd\ta8abb583-0549-4391-aa87-170477b3cbbe',
      '92094\teb37d0cd-9af1-48b2-a1e8-b36db566e11f\t88637e75-cbe2-45b4-9406-c5f8543372ba'
    ].join('\n')
  },
  eligibility: {
    screen: 'Bulk Eligibility',
    filePrefix: 'create_eligibility_bulk_request',
    seqKeyPrefix: 'bulkEligibilitySeq',
    columns: ['BusinessId'],
    uuidColumns: [],
    placeholder: [
      '419ecd58-bca3-4058-b6c0-9f9f4e5e3017',
      '5fc03ba6-b9c1-47a2-9a98-3efb8ffb8efd'
    ].join('\n')
  }
};
