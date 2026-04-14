import React from 'react';
import { Plus, X, GitCommit, Trash2, Network } from 'lucide-react';
import { OPERATORS, createEmptyRule, createEmptyGroup } from '../utils/filterUtils';
import './QueryBuilder.css';

const Rule = ({ rule, fields, updateRule, removeRule, addRule, addGroup }) => {
  return (
    <div className="o-rule-row">
      <div className="o-rule-controls">
        <select 
          className="o-rule-select o-field-select"
          value={rule.field} 
          onChange={(e) => updateRule(rule.id, 'field', e.target.value)}
        >
          {fields.map(f => (
            <option key={f.key} value={f.key}>{f.label}</option>
          ))}
        </select>

        <select 
          className="o-rule-select o-op-select"
          value={rule.operator} 
          onChange={(e) => updateRule(rule.id, 'operator', e.target.value)}
        >
          {OPERATORS.map(op => (
            <option key={op.value} value={op.value}>{op.label}</option>
          ))}
        </select>

        {!['is_empty', 'not_empty'].includes(rule.operator) && (
          <input 
            type="text" 
            className="o-rule-input"
            value={rule.value} 
            onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
          />
        )}
      </div>

      <div className="o-rule-actions">
        <button onClick={addRule} title="Thêm điều kiện"><Plus size={16}/></button>
        <button onClick={addGroup} title="Thêm nhánh (nhóm)"><Network size={16}/></button>
        <button onClick={() => removeRule(rule.id)} title="Xóa"><Trash2 size={16}/></button>
      </div>
    </div>
  );
};

const Group = ({ group, fields, updateGroup, removeGroup, isRoot }) => {
  const handleUpdateRule = (id, prop, val) => {
    const editRecursive = (rules) => {
      return rules.map(item => {
        if (item.rules) return { ...item, rules: editRecursive(item.rules) };
        if (item.id === id) return { ...item, [prop]: val };
        return item;
      });
    };
    updateGroup(group.id, 'rules', editRecursive(group.rules));
  };

  const handleRemoveRuleOrGroup = (id) => {
    const filterRecursive = (rules) => {
      const filtered = rules.filter(r => r.id !== id);
      return filtered.map(item => {
        if (item.rules) return { ...item, rules: filterRecursive(item.rules) };
        return item;
      });
    };
    updateGroup(group.id, 'rules', filterRecursive(group.rules));
  };

  const handleAddRule = () => {
    updateGroup(group.id, 'rules', [...group.rules, createEmptyRule(fields)]);
  };

  const handleAddGroup = () => {
    updateGroup(group.id, 'rules', [...group.rules, createEmptyGroup(fields)]);
  };

  return (
    <div className={`o-group ${isRoot ? 'o-group-root' : ''}`}>
      <div className="o-group-header">
        {isRoot ? (
          <div className="o-group-sentence">
            <span>Match</span>
            <select 
              className="o-combinator" 
              value={group.combinator}
              onChange={(e) => updateGroup(group.id, 'combinator', e.target.value)}
            >
              <option value="AND">all</option>
              <option value="OR">any</option>
            </select>
            <span>of the following rules:</span>
          </div>
        ) : (
          <div className="o-group-sentence">
            <select 
              className="o-combinator" 
              value={group.combinator}
              onChange={(e) => updateGroup(group.id, 'combinator', e.target.value)}
            >
              <option value="AND">all</option>
              <option value="OR">any</option>
            </select>
            <span>of:</span>
          </div>
        )}
      </div>
      
      <div className="o-rules-list">
        {group.rules.map(child => {
          if (child.rules) {
            return (
              <Group 
                key={child.id} 
                group={child} 
                fields={fields}
                updateGroup={handleUpdateRule}
                removeGroup={handleRemoveRuleOrGroup}
                isRoot={false}
              />
            );
          } else {
            return (
              <Rule 
                key={child.id} 
                rule={child}
                fields={fields}
                updateRule={handleUpdateRule}
                removeRule={handleRemoveRuleOrGroup}
                addRule={handleAddRule}
                addGroup={handleAddGroup}
              />
            );
          }
        })}
      </div>

      <div className="o-group-footer">
        <span className="o-new-rule-link" onClick={handleAddRule}>
          New Rule
        </span>
      </div>
    </div>
  );
};

export const QueryBuilder = ({ query, fields, onChange }) => {
  const handleRootUpdate = (id, prop, val) => {
    onChange({ ...query, [prop]: val });
  };

  return (
    <div className="odoo-query-container">
      <Group 
        group={query} 
        fields={fields}
        updateGroup={handleRootUpdate}
        removeGroup={() => {}}
        isRoot={true}
      />
    </div>
  );
};
