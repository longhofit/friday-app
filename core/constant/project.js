export const typeEnum = {
  ALL: 'All types',
  CUSTOMER: 'Customer',
  INTERNAL: 'Internal',
}

export const statusEnum = {
  ALL: 'All statuses',
  NEW: 'New',
  ARCHIVED: 'Archived',
  SUSPEND: 'Suspend',
  RUNNING: 'Running'
}

export const frequencyEnum = {
  ALL: 'All frequencys',
  EVERYDAY: 'Everyday',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
}

export const typeFilterData = [
  {
    label: typeEnum.ALL,
    value: 'ALL',
  },
  {
    label: typeEnum.CUSTOMER,
    value: 'CUSTOMER',
  },
  {
    label: typeEnum.INTERNAL,
    value: 'INTERNAL',
  },
]

export const statusFilterData = [
  {
    label: statusEnum.ALL,
    value: 'ALL'
  },
  {
    label: statusEnum.NEW,
    value: 'NEW',
  },
  {
    label: statusEnum.ARCHIVED,
    value: 'ARCHIVED',
  },
  {
    label: statusEnum.SUSPEND,
    value: 'SUSPEND',
  },
  {
    label: statusEnum.RUNNING,
    value: 'RUNNING',
  },
]

export const frequencyFilterData = [
  {
    label: frequencyEnum.ALL,
    value: 'ALL',
  },
  {
    label: frequencyEnum.EVERYDAY,
    value: 'EVERYDAY'
  },
  {
    label: frequencyEnum.WEEKLY,
    value: 'WEEKLY',
  },
  {
    label: frequencyEnum.MONTHLY,
    value: 'MONTHLY',
  },
]