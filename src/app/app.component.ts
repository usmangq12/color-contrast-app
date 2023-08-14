import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  // To store the color values
  foregroundHexaColor: string = "#0000FF";
  foregroundColor: string = "#0000FF";
  backgroundHexaColor: string = "#FFFFFF";
  backgroundColor: string = "#FFFFFF";

  // To display the WCAG Large Text AA, AAA results
  largeText_WCAG_AA: string = "";
  largeText_WCAG_AAA: string = "";

  // To display the WCAG Normal Text AA, AAA results
  normalText_WCAG_AA: string = "";
  normalText_WCAG_AAA: string = "";

  // To store the contrast ratio results
  contrastRatio: number = 0;

  constructor() {
    const contrastRatio = this.calculateContrastRatio(
      this.foregroundColor,
      this.backgroundColor
    );
    // To calculate the normal and large texts contrast ratio on initial load
    this.getTexts_WCAG_ContrastResults(contrastRatio);
  }

  calculateRelativeLuminance(r: number, g: number, b: number): number {
    const normalizedR = r / 255;
    const normalizedG = g / 255;
    const normalizedB = b / 255;

    const luminance =
      0.2126 * normalizedR + 0.7152 * normalizedG + 0.0722 * normalizedB;
    return luminance;
  }

  calculateContrastRatio(color1: string, color2: string): number {
    const color1Rgb = this.hexToRgb(color1);
    const color2Rgb = this.hexToRgb(color2);

    const luminance1 = this.calculateRelativeLuminance(
      color1Rgb.r,
      color1Rgb.g,
      color1Rgb.b
    );
    const luminance2 = this.calculateRelativeLuminance(
      color2Rgb.r,
      color2Rgb.g,
      color2Rgb.b
    );

    const contrastRatio =
      (Math.max(luminance1, luminance2) + 0.05) /
      (Math.min(luminance1, luminance2) + 0.05);
    const fixedPointsContrastRatio = Number(contrastRatio.toFixed(2));

    this.contrastRatio = fixedPointsContrastRatio;

    return fixedPointsContrastRatio;
  }

  hexToRgb(hex: string): { r: number; g: number; b: number } {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  get_WCAG_AA_ContrastComplianceLevel(
    contrastRatio: number,
    isLargeText: boolean
  ): string {
    if (isLargeText) {
      if (contrastRatio >= 3) {
        return "Pass";
      }
    } else {
      if (contrastRatio >= 4.5) {
        return "Pass";
      }
    }

    return "Fail";
  }

  get_WCAG_AAA_ContrastComplianceLevel(
    contrastRatio: number,
    isLargeText: boolean
  ): string {
    if (isLargeText) {
      if (contrastRatio >= 4.5) {
        return "Pass";
      }
    } else {
      if (contrastRatio >= 7) {
        return "Pass";
      }
    }

    return "Fail";
  }

  getTexts_WCAG_ContrastResults(contrastRatio: number) {
    // To get large text WCAG AA, AAA results calling get_WCAG_AA_ContrastComplianceLevel by passing contrast ratio and large text boolean true as arguements
    this.largeText_WCAG_AA = this.get_WCAG_AA_ContrastComplianceLevel(
      contrastRatio,
      true
    );
    this.largeText_WCAG_AAA = this.get_WCAG_AAA_ContrastComplianceLevel(
      contrastRatio,
      true
    );

    // To get large text WCAG AA results calling get_WCAG_AA_ContrastComplianceLevel by passing contrast ratio and large text boolean true as arguements
    this.normalText_WCAG_AA = this.get_WCAG_AA_ContrastComplianceLevel(
      contrastRatio,
      false
    );
    this.normalText_WCAG_AAA = this.get_WCAG_AAA_ContrastComplianceLevel(
      contrastRatio,
      false
    );
    console.log("contrastRatio **", contrastRatio);
  }

  onColorChange(value: string) {
    const contrastRatio = this.calculateContrastRatio(
      this.foregroundColor,
      this.backgroundColor
    );
    // To calculate the normal and large texts contrast ratio on update
    this.getTexts_WCAG_ContrastResults(contrastRatio);
  }

  onForegroundHexaColorChange(value: string) {
    const contrastRatio = this.calculateContrastRatio(
      this.foregroundHexaColor,
      this.backgroundHexaColor
    );
    if (value.length === 7) {
      this.foregroundColor = this.foregroundHexaColor;
      this.getTexts_WCAG_ContrastResults(contrastRatio);
    }
  }

  onBackgroundHexaColorChange(value: string) {
    const contrastRatio = this.calculateContrastRatio(
      this.foregroundHexaColor,
      this.backgroundHexaColor
    );
    if (value.length === 7) {
      this.backgroundColor = value;
      this.getTexts_WCAG_ContrastResults(contrastRatio);
    }
  }

  title = "color-contrast-checker";
}
