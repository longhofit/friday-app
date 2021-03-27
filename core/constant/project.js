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
    value: typeEnum.ALL,
  },
  {
    label: typeEnum.CUSTOMER,
    value: typeEnum.CUSTOMER,
  },
  {
    label: typeEnum.INTERNAL,
    value: typeEnum.INTERNAL,
  },
]

export const statusFilterData = [
  {
    label: statusEnum.ALL,
    value: statusEnum.ALL,
  },
  {
    label: statusEnum.NEW,
    value: statusEnum.NEW,
  },
  {
    label: statusEnum.ARCHIVED,
    value: statusEnum.ARCHIVED,
  },
  {
    label: statusEnum.SUSPEND,
    value: statusEnum.SUSPEND,
  },
  {
    label: statusEnum.RUNNING,
    value: statusEnum.RUNNING,
  },
]

export const frequencyFilterData = [
  {
    label: frequencyEnum.ALL,
    value: frequencyEnum.ALL,
  },
  {
    label: frequencyEnum.EVERYDAY,
    value: frequencyEnum.EVERYDAY,
  },
  {
    label: frequencyEnum.WEEKLY,
    value: frequencyEnum.WEEKLY,
  },
  {
    label: frequencyEnum.MONTHLY,
    value: frequencyEnum.MONTHLY,
  },
]