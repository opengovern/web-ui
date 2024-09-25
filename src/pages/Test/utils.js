// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export const getFieldOnChange =
    (fieldType, fieldKey, onChangeFn) =>
    ({ detail: { selectedOption, value } }) =>
        onChangeFn({
            // eslint-disable-next-line no-nested-ternary
            [fieldKey]:
                // eslint-disable-next-line no-nested-ternary
                fieldType === 'select'
                    ? selectedOption
                    : fieldType === 'slider'
                    ? Number(value)
                    : value,
        })
