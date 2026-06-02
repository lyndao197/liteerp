export const OPERATORS = [
  { value: 'contains', label: 'Chứa' },
  { value: 'not_contains', label: 'Không chứa' },
  { value: 'equals', label: 'Bằng (==)' },
  { value: 'not_equals', label: 'Không bằng (!=)' },
  { value: 'starts_with', label: 'Bắt đầu bằng' },
  { value: 'ends_with', label: 'Kết thúc bằng' },
  { value: 'is_empty', label: 'Trống' },
  { value: 'not_empty', label: 'Không trống' },
  { value: 'greater_than', label: 'Lớn hơn (>)' },
  { value: 'less_than', label: 'Nhỏ hơn (<)' }
];

export const evaluateRule = (itemValue, operator, ruleValue, field) => {
  let v1 = String(itemValue || '').toLowerCase();
  let v2 = String(ruleValue || '').toLowerCase();

  if (field === 'id') {
    v1 = `act-${new Date().getFullYear()}-${String(itemValue).padStart(5, '0')}`.toLowerCase();
  }

  switch (operator) {
    case 'contains': return v1.includes(v2);
    case 'not_contains': return !v1.includes(v2);
    case 'equals': return v1 === v2;
    case 'not_equals': return v1 !== v2;
    case 'starts_with': return v1.startsWith(v2);
    case 'ends_with': return v1.endsWith(v2);
    case 'is_empty': return v1.trim() === '';
    case 'not_empty': return v1.trim() !== '';
    case 'greater_than': return parseFloat(v1) > parseFloat(v2);
    case 'less_than': return parseFloat(v1) < parseFloat(v2);
    default: return true;
  }
};

export const evaluateQuery = (item, query) => {
  if (!query || !query.rules || query.rules.length === 0) return true;

  const results = query.rules.map(ruleOrGroup => {
    if (ruleOrGroup.rules) {
      // Nhóm điều kiện
      if (ruleOrGroup.rules.length === 0) return true;
      return evaluateQuery(item, ruleOrGroup);
    } else {
      // Luật đơn lẻ
      return evaluateRule(item[ruleOrGroup.field], ruleOrGroup.operator, ruleOrGroup.value, ruleOrGroup.field);
    }
  });

  if (query.combinator === 'AND') {
    return results.every(res => res === true);
  } else {
    // OR
    return results.some(res => res === true);
  }
};

export const createEmptyRule = (fields) => ({
  id: Date.now() + Math.random().toString(),
  field: fields[0]?.key || '',
  operator: 'contains',
  value: ''
});

export const createEmptyGroup = (fields) => ({
  id: Date.now() + Math.random().toString(),
  combinator: 'AND',
  rules: [createEmptyRule(fields)]
});
