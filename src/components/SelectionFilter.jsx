import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * @description A filter component that renders a list of selectable options with checkboxes
 * This component manages its own state for selected options and notifies a parent
 * component of any changes.
 *
 * @param {object} props - The component props.
 * @param {string} props.title - The title for the filter group.
 * @param {string[]} props.options - An array of strings, where each string is a selectable option.
 * @param {string[]} props.initialSelected - An optional array of initially selected options.
 * @param {function} props.onSelectionChange - A callback function that is triggered when the selection changes.
 */
function SelectionFilter({ title, options, initialSelected, onSelectionChange }) {
  // Use a `Set` for efficient management of selected options (O(1) lookups).
  const [selectedOptions, setSelectedOptions] = useState(new Set(initialSelected));

  // A useEffect hook to update the component's internal state if the initialSelected prop changes.
  useEffect(() => {
    setSelectedOptions(new Set(initialSelected));
  }, [initialSelected]);

  /**
   * @description Handles the change event for a checkbox.
   * @param {string} option - The option associated with the checkbox that was changed.
   */
  const handleCheckboxChange = (option) => {
    const newSelectedOptions = new Set(selectedOptions);

    if (newSelectedOptions.has(option)) {
      newSelectedOptions.delete(option);
    } else {
      newSelectedOptions.add(option);
    }

    setSelectedOptions(newSelectedOptions);

    // Call the callback function with the updated list of selected options.
    if (onSelectionChange) {
      onSelectionChange(Array.from(newSelectedOptions));
    }
  };

  return (
    <>
      <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">{title}</h3>
      <div className="px-4">
        {options.map((op) => (
          <label key={op} className="flex gap-x-3 py-3 flex-row">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-[#dae7e3] border-2 bg-transparent text-[#00c795] checked:bg-[#00c795] checked:border-[#00c795] checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-[#dae7e3] focus:outline-none"
              checked={selectedOptions.has(op)}
              onChange={() => handleCheckboxChange(op)}
            />
            <p className="text-[#101816] text-base font-normal leading-normal">{op}</p>
          </label>
        ))}
      </div>
    </>
  );
}

// **Prop Validation with PropTypes**
SelectionFilter.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  initialSelected: PropTypes.arrayOf(PropTypes.string),
  onSelectionChange: PropTypes.func,
};

// **Default Props**
SelectionFilter.defaultProps = {
  initialSelected: [],
  onSelectionChange: () => {},
};

export default SelectionFilter;