import ExcelJS from 'exceljs';
import Society from '../models/Society.js';
import Benchmark from '../models/Benchmark.js';
import SocietyBenchmark from '../models/SocietyBenchmark.js';

const CATEGORY_COLORS = {
  'Building & Maintenance': 'FFD6E4BC',
  'Utilities':              'FFB8D4E8',
  'Security & Safety':      'FFFDE9B1',
  'Amenities & Recreation': 'FFFFD6CC',
  'Administration':         'FFE8D5F0',
};

const HEADER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2C3E50' } };
const HEADER_FONT = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
const SECTION_FONT = { bold: true, size: 11 };

function applyHeaderStyle(cell) {
  cell.fill = HEADER_FILL;
  cell.font = HEADER_FONT;
  cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  cell.border = {
    top: { style: 'thin' }, bottom: { style: 'thin' },
    left: { style: 'thin' }, right: { style: 'thin' },
  };
}

function applyDataCell(cell, argbColor) {
  if (argbColor) {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: argbColor } };
  }
  cell.border = {
    top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
    bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
    left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
    right: { style: 'thin', color: { argb: 'FFD0D0D0' } },
  };
  cell.alignment = { vertical: 'middle', wrapText: true };
}

const calculateStats = (values) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const median = n % 2 === 0
    ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
    : sorted[Math.floor(n / 2)];
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  return { mean, median, stdDev, min: sorted[0], max: sorted[n - 1], count: n };
};

export const exportExcel = async (req, res) => {
  try {
    const [societies, benchmarks, societyBenchmarks] = await Promise.all([
      Society.find().sort({ name: 1 }),
      Benchmark.find().sort({ category: 1, name: 1 }),
      SocietyBenchmark.find().populate(['societyId', 'benchmarkId']),
    ]);

    // Build lookup: societyId -> benchmarkId -> value
    const valueMap = {};
    for (const sb of societyBenchmarks) {
      const sid = sb.societyId._id.toString();
      const bid = sb.benchmarkId._id.toString();
      if (!valueMap[sid]) valueMap[sid] = {};
      valueMap[sid][bid] = sb.value;
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Society Comparison Tool';
    workbook.created = new Date();

    // ─── Sheet 1: Societies Overview ────────────────────────────────────────
    const societySheet = workbook.addWorksheet('Societies Overview');
    societySheet.columns = [
      { header: 'Society Name',     key: 'name',            width: 30 },
      { header: 'Location',         key: 'location',        width: 25 },
      { header: 'Total Flats',      key: 'totalFlats',      width: 14 },
      { header: 'Total Area (sq ft)',key: 'totalArea',      width: 18 },
      { header: 'Year Established', key: 'yearEstablished', width: 18 },
    ];

    // Style header row
    societySheet.getRow(1).eachCell(applyHeaderStyle);
    societySheet.getRow(1).height = 30;

    societies.forEach((s, i) => {
      const row = societySheet.addRow({
        name:            s.name,
        location:        s.location || '',
        totalFlats:      s.totalFlats,
        totalArea:       s.totalArea,
        yearEstablished: s.yearEstablished || '',
      });
      const bg = i % 2 === 0 ? 'FFF5F5F5' : 'FFFFFFFF';
      row.eachCell(cell => applyDataCell(cell, bg));
      row.getCell('name').font = SECTION_FONT;
      row.height = 20;
    });

    // Summary row
    const summaryRow = societySheet.addRow({
      name: `Total: ${societies.length} societies`,
    });
    summaryRow.getCell('name').font = { bold: true, italic: true };
    summaryRow.height = 20;

    // ─── Sheet 2: Benchmark Data ─────────────────────────────────────────────
    const benchmarkSheet = workbook.addWorksheet('Benchmark Data');

    // Build headers: Society details + one column per benchmark
    const fixedCols = [
      { header: 'Society Name', key: 'name',   width: 28 },
      { header: 'Location',     key: 'loc',    width: 20 },
      { header: 'Total Flats',  key: 'flats',  width: 13 },
      { header: 'Area (sq ft)', key: 'area',   width: 15 },
    ];
    const benchmarkCols = benchmarks.map(b => ({
      header: `${b.name}\n(${b.unit})`,
      key:    b._id.toString(),
      width:  20,
    }));
    benchmarkSheet.columns = [...fixedCols, ...benchmarkCols];

    // Style header row + add category sub-header row
    const headerRow = benchmarkSheet.getRow(1);
    headerRow.eachCell(applyHeaderStyle);
    headerRow.height = 45;

    // Category color bands on header
    benchmarks.forEach((b, idx) => {
      const col = fixedCols.length + idx + 1;
      const cell = headerRow.getCell(col);
      const catColor = CATEGORY_COLORS[b.category];
      if (catColor) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: catColor } };
        cell.font = { bold: true, size: 10, color: { argb: 'FF1A1A2E' } };
      }
    });

    // Data rows
    societies.forEach((s, i) => {
      const sid = s._id.toString();
      const rowData = {
        name:  s.name,
        loc:   s.location || '',
        flats: s.totalFlats,
        area:  s.totalArea,
      };
      benchmarks.forEach(b => {
        const bid = b._id.toString();
        rowData[bid] = valueMap[sid]?.[bid] ?? '';
      });

      const row = benchmarkSheet.addRow(rowData);
      const bg = i % 2 === 0 ? 'FFF5F5F5' : 'FFFFFFFF';
      row.eachCell((cell, colNum) => {
        if (colNum <= fixedCols.length) {
          applyDataCell(cell, bg);
        } else {
          const b = benchmarks[colNum - fixedCols.length - 1];
          const catColor = CATEGORY_COLORS[b.category];
          // Lighten category color for data rows
          applyDataCell(cell, i % 2 === 0 && catColor ? catColor.replace('FF', 'EE') : bg);
          if (cell.value !== '') {
            cell.numFmt = '0.00';
          }
        }
      });
      row.getCell('name').font = SECTION_FONT;
      row.height = 20;
    });

    // Freeze panes after header + first column
    benchmarkSheet.views = [{ state: 'frozen', xSplit: 1, ySplit: 1 }];

    // ─── Sheet 3: Statistics Summary ─────────────────────────────────────────
    const statsSheet = workbook.addWorksheet('Statistics Summary');
    statsSheet.columns = [
      { header: 'Benchmark Name',  key: 'name',    width: 30 },
      { header: 'Category',        key: 'category',width: 24 },
      { header: 'Societies Count', key: 'count',   width: 16 },
      { header: 'Mean (per sq ft)',key: 'mean',    width: 16 },
      { header: 'Median',          key: 'median',  width: 14 },
      { header: 'Std Dev',         key: 'stdDev',  width: 14 },
      { header: 'Min',             key: 'min',     width: 12 },
      { header: 'Max',             key: 'max',     width: 12 },
    ];
    statsSheet.getRow(1).eachCell(applyHeaderStyle);
    statsSheet.getRow(1).height = 30;

    benchmarks.forEach((b, i) => {
      const bid = b._id.toString();
      const values = societies
        .map(s => valueMap[s._id.toString()]?.[bid])
        .filter(v => v !== undefined && v !== null && v !== '');

      const stats = calculateStats(values);
      const catColor = CATEGORY_COLORS[b.category] || 'FFFFFFFF';

      const row = statsSheet.addRow({
        name:     b.name,
        category: b.category,
        count:    stats ? stats.count : 0,
        mean:     stats ? parseFloat(stats.mean.toFixed(4)) : '',
        median:   stats ? parseFloat(stats.median.toFixed(4)) : '',
        stdDev:   stats ? parseFloat(stats.stdDev.toFixed(4)) : '',
        min:      stats ? stats.min : '',
        max:      stats ? stats.max : '',
      });

      row.eachCell((cell, colNum) => {
        applyDataCell(cell, colNum <= 2 ? catColor : (i % 2 === 0 ? 'FFF9F9F9' : 'FFFFFFFF'));
        if (colNum >= 4 && cell.value !== '') cell.numFmt = '0.0000';
      });
      row.getCell('name').font = SECTION_FONT;
      row.height = 20;
    });

    // ─── Sheet 4: Data Entry Template ────────────────────────────────────────
    const templateSheet = workbook.addWorksheet('Data Entry Template');
    templateSheet.columns = [
      { header: 'Society Name',       key: 'name',            width: 30 },
      { header: 'Location',           key: 'location',        width: 25 },
      { header: 'Total Flats',        key: 'totalFlats',      width: 14 },
      { header: 'Total Area (sq ft)', key: 'totalArea',       width: 18 },
      { header: 'Year Established',   key: 'yearEstablished', width: 18 },
      ...benchmarks.map(b => ({
        header: `${b.name} (${b.unit})`,
        key:    b._id.toString(),
        width:  22,
      })),
    ];

    const templateHeader = templateSheet.getRow(1);
    templateHeader.eachCell(applyHeaderStyle);
    templateHeader.height = 35;

    // Add 10 blank rows for data entry
    for (let i = 0; i < 10; i++) {
      const row = templateSheet.addRow({});
      const bg = i % 2 === 0 ? 'FFFFF9F0' : 'FFFFFFFF';
      row.eachCell ? null : null;
      for (let c = 1; c <= templateSheet.columns.length; c++) {
        const cell = row.getCell(c);
        applyDataCell(cell, bg);
      }
      row.height = 20;
    }

    templateSheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

    // ─── Send response ────────────────────────────────────────────────────────
    const filename = `society-comparison-${new Date().toISOString().slice(0, 10)}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({ error: error.message });
  }
};
