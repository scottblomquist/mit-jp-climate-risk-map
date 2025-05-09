import {
    Autocomplete,
    Button,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { GeographyType } from '../MapApi'
import { DataSource } from '../MapVisualization'
import DatasetEditor from './DatasetEditor'
import NewSourceInput from './NewSourceInput'
import { FormData } from './UploadData'
import css from './Uploader.module.css'
import {
    Dataset,
    createDataset,
    setDateColumn,
    setExistingSource,
    setGeographyType,
    setIdColumn,
    toggleExistingSource,
} from './uploaderSlice'

export const INPUT_MARGIN = { margin: '0.5em 0' }

function getPossibleColumns(
    columns: string[],
    datasets: Dataset[],
    idColumn: string | undefined,
    dateColumn: string | undefined,
    datasetId: string
): string[] {
    const otherDatasetColumns = datasets
        .filter((dataset) => dataset.id !== datasetId)
        .map((dataset) => dataset.column)

    return (
        columns.filter(
            (column) =>
                column !== idColumn &&
                column !== dateColumn &&
                !otherDatasetColumns.includes(column)
        ) ?? []
    )
}

export default function MetadataForm({
    geographyType,
    idColumn,
    dateColumn,
    source,
    datasets,
    geographyTypes,
    columns,
    freeColumns,
    dataSources,
}: FormData & { dataSources: DataSource[]; geographyTypes: GeographyType[] }) {
    const dispatch = useDispatch()

    return (
        <>
            <h2>
                Select <span className={css.idColumn}>geographic ID column</span>
            </h2>
            <Select
                required
                label="Geography type"
                onChange={(e) => dispatch(setGeographyType(Number(e.target.value)))}
                value={geographyType}
            >
                {geographyTypes.map((type) => (
                    <MenuItem value={type.id} key={type.id}>
                        {type.name}
                    </MenuItem>
                ))}
            </Select>
            <Select
                required
                label="Geographic id column"
                onChange={(e) => dispatch(setIdColumn(e.target.value))}
                value={idColumn}
            >
                {columns.map((column) => (
                    <MenuItem value={column} key={column}>
                        {column}
                    </MenuItem>
                ))}
            </Select>

            <h2>
                Select <span className={css.dateColumn}>year column</span>
            </h2>
            <Select
                required
                label="Date"
                onChange={(e) => dispatch(setDateColumn(e.target.value))}
                value={dateColumn}
            >
                {columns.map((column) => (
                    <MenuItem value={column} key={column}>
                        {column}
                    </MenuItem>
                ))}
            </Select>

            <h2>Source</h2>
            <FormControlLabel
                control={
                    <Checkbox
                        name="Use Existing Source"
                        value={'id' in source}
                        onChange={(_, value) =>
                            dispatch(toggleExistingSource(value ? dataSources[0] : undefined))
                        }
                    />
                }
                label="Use Existing Source"
            />

            {'id' in source && (
                <Autocomplete
                    sx={INPUT_MARGIN}
                    value={source}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(_, value) => {
                        if (value) dispatch(setExistingSource(value))
                    }}
                    options={dataSources}
                    renderInput={(params) => <TextField {...params} label="Name" />}
                />
            )}
            {!('id' in source) && <NewSourceInput source={source} />}
            <h2>
                Select <span className={css.dataColumn}>data columns</span>
            </h2>
            {datasets.map((dataset) => (
                <DatasetEditor
                    dataset={dataset}
                    key={dataset.id}
                    possibleColumns={getPossibleColumns(
                        columns,
                        datasets,
                        idColumn,
                        dateColumn,
                        dataset.id
                    )}
                    deletable={datasets.length > 1}
                />
            ))}

            <Button
                onClick={() => dispatch(createDataset())}
                disabled={freeColumns.length === 0}
                variant="outlined"
            >
                Add dataset
            </Button>
        </>
    )
}
